import { FormControlLabel, Checkbox } from "@mui/material";
import { Search } from "../pages/SearchRoot";

interface SearchCheckboxesProps {
    search: Search
    setSearch: React.Dispatch<React.SetStateAction<Search>>;
}

export const SearchCheckboxes = (props: SearchCheckboxesProps) => {
    const { city, airport } = props.search;

    // Handle change event on clicking checkboxes
    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        // Update the state based on the checkbox value and its checked status
        props.setSearch((prev) => ({
            ...prev,
            [value]: checked,
        }));
    };
    



    return (
        <div>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={city}
                        onChange={onCheckboxChange}
                        value="city"
                    />
                }
                label="City"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={airport}
                        onChange={onCheckboxChange}
                        value="airport"
                    />
                }
                label="Airport"
            />
        </div>
    )
}
