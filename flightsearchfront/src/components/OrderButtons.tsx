import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react"
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi";

const sortIcon = (order: string) => {
    if (order === "none") {
        return (<></>)
    } else if (order === "asc") {
        return (<HiOutlineSortDescending />)
    } else if (order === "desc") {
        return (<HiOutlineSortAscending />)
    }
}

const getStyle = (order: string): string => {
    if (order === "none") {
        return "btn m-2";
    }
    return "btn m-2 active";
}

interface OrderButtonsProps { 
    orderPrice: string,
    orderDuration: string,
    setOrderPrice: React.Dispatch<React.SetStateAction<string>>,
    setOrderDuration: React.Dispatch<React.SetStateAction<string>>
}

export const OrderButtons = ({
    orderPrice,
    orderDuration,
    setOrderPrice,
    setOrderDuration
}: OrderButtonsProps) => {

    const handleTogglePrice = () => {
        if (orderPrice === "none") {
            setOrderPrice("asc");
        } else if (orderPrice === "asc") {
            setOrderPrice("desc")
        } else if (orderPrice === "desc") {
            setOrderPrice("none")
        }
    }

    const handleToggleDuration = () => {
        if (orderDuration === "none") {
            setOrderDuration("asc");
        } else if (orderDuration === "asc") {
            setOrderDuration("desc")
        } else if (orderDuration === "desc") {
            setOrderDuration("none")
        }
    }

    return (
        <Box display="flex" flexDirection="row" alignContent="space-between" alignItems="center">
            Order by: 
            <Button 
                onClick={handleTogglePrice}
                className={getStyle(orderPrice)}>
                Price    {sortIcon(orderPrice)}
            </Button>
            <Button 
                onClick={handleToggleDuration}
                className={getStyle(orderDuration)}>
                Duration    {sortIcon(orderDuration)}
            </Button>
        </Box>
    );
}
