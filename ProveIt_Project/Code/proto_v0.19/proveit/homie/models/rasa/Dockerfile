FROM continuumio/miniconda3

RUN conda create -n homie python=3.9 -y

WORKDIR /app

COPY ./ /app

RUN chmod +x startup.sh

RUN conda run -n homie pip install rasa --progress-bar off

RUN chmod g+rwX -R /app
RUN chgrp -R 0 /app

USER 1001

EXPOSE 5005

CMD /bin/bash -c "source activate homie && /app/startup.sh"