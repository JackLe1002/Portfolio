import React, { useEffect, useState } from "react";
import { Dropdown, FormControl } from "react-bootstrap";

interface Stringifiable {
    toString(): string;
}

interface SearchableDropdownProps<
    T extends Record<K, Stringifiable>,
    K extends keyof T,
> {
    items: T[];
    onSelect: (item: T) => void;
    placeholder: string;
    labelKey: K;
}

const SearchableDropdown = <
    T extends Record<K, Stringifiable>,
    K extends keyof T,
>({
    items,
    onSelect,
    placeholder,
    labelKey,
}: SearchableDropdownProps<T, K>) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState<T[]>(items);

    useEffect(() => {
        setFilteredItems(items); // Initialize filteredItems with all items
    }, [items]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredItems(
            items.filter(
                (item) =>
                    item[labelKey] &&
                    item[labelKey].toString().toLowerCase().includes(value),
            ),
        );
    };

    return (
        <Dropdown
            className="searchableDropdown"
            show={open}
            onToggle={() => setOpen(!open)}
        >
            <Dropdown.Toggle variant="success" id="dropdown-custom-components">
                {placeholder}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={handleSearchChange}
                    value={search}
                />
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {filteredItems.map((item, index) => (
                        <Dropdown.Item
                            key={index}
                            onClick={() => {
                                onSelect(item);
                                setOpen(false);
                            }}
                        >
                            {item[labelKey] ? item[labelKey].toString() : ""}
                        </Dropdown.Item>
                    ))}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SearchableDropdown;
