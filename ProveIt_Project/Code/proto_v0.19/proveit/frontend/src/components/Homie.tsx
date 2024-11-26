import React, {useState, useEffect, useRef} from "react";
import "../styles/components/homie.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faTimes , faMicrophone, faMicrophoneSlash} from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../hooks/useAuthContext";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import Button from "react-bootstrap/Button";

interface IMessage {
    id: number;
    text: string;
    sender: string;
}

interface IRasaResponse {
    recipient_id: string;
    text: string;
}

interface HomieProps {
    propertyId: string;
}

const Homie = ({ propertyId }: HomieProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [userInput, setUserInput] = useState<string>("");
    const [isThinking, setIsThinking] = useState<boolean>(false);

    const { state } = useAuthContext();
    const { user } = state;

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setUserInput(transcript);
        }
    }, [transcript]);

    const startDictation = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopDictation = () => {
        SpeechRecognition.stopListening();
    };

    const toggleChatbot = () => setIsOpen(!isOpen);

    const processMessage = async (botMessage: IRasaResponse) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: prevMessages.length + 1,
                        text: botMessage.text,
                        sender: "bot",
                    },
                ]);
                resolve();
            }, botMessage.text.length * 30);
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const messageToSend = userInput.trim();
        if (!messageToSend) return;

        setUserInput("");
        setIsThinking(true);

        const userId = user?.token;
        const userMessage: IMessage = {
            id: messages.length + 1,
            text: messageToSend,
            sender: userId || "unknown",
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
            try {
                const response = await fetch(
                    `${window.config.SERVER_URL}/chat-response`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            sender: userId,
                            message: messageToSend,
                            metadata: { propertyId: propertyId },
                        }),
                    },
                );

                const responseData: IRasaResponse[] = await response.json();
                for (const botMessage of responseData) {
                    await processMessage(botMessage);
                }
                setIsThinking(false);
            } catch (error) {
                console.error("Error sending message to Rasa:", error);
            }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (listening) {
            stopDictation();
        }
        setUserInput(e.target.value);
    };

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
            {!isOpen ? (
                <button className="chatbot-toggle" onClick={toggleChatbot}>
                    <FontAwesomeIcon icon={faRobot} className="large-icon"/>
                </button>
            ) : null}

                <div className="chatbot-window">
                    <div className="chat-header">
                        <h2>Homie</h2>
                        <button className="close-chat" onClick={toggleChatbot}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat-message ${
                                    msg.sender !== "bot"
                                        ? "user-message"
                                        : "bot-message"
                                }`}
                            >
                                <div className="message-text">{msg.text}</div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="chat-message bot-message bot-thinking">
                                <div className="message-text">...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef}/>
                    </div>
                    <form onSubmit={handleSubmit} className="message-form">
                        {browserSupportsSpeechRecognition ? (
                            <Button className="speech-button"
                                variant={listening ? "danger" : "primary"}
                                onClick={() => listening ? stopDictation() : startDictation()}
                            >
                                <FontAwesomeIcon icon={listening ? faMicrophoneSlash : faMicrophone} />
                                {listening ? " Stop Talking" : " Start Talking"}
                            </Button>
                        ) : null}

                        <input
                            type="text"
                            value={userInput}
                            onChange={handleChange}
                            className="message-input"
                            placeholder="Type or speak"
                        />

                        <Button type="submit" className="send-button">
                            Send
                        </Button>
                    </form>
                </div>
        </div>
    );
};

export default Homie;
