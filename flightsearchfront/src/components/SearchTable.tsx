import React from 'react'
import { DataSource, Search } from '../pages/SearchRoot'
import { Paper, Table, LinearProgress, TableBody, TableHead, TableCell, TableRow, TablePagination } from '@mui/material';

interface SearchTableProps {
    dataSource: DataSource
    search: Search
    setSearch: React.Dispatch<React.SetStateAction<Search>>
    loading: Boolean
}



export const SearchTable = (props: SearchTableProps) => {
    const { data, meta } = props.dataSource;

    return (
        <Paper sx={{ width: "100%", overflowX: "auto", position: "relative" }}>
            {/* Loader for improving UX */}
            {props.loading && <LinearProgress variant="indeterminate" sx={{ position: "absolute", width: "100%" }} />}

            <Table sx={{ minWidth: 650 }} aria-label="simple table">

                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">City</TableCell>
                        <TableCell align="right">Country</TableCell>
                        <TableCell align="right">Country Code</TableCell>
                        <TableCell align="right">IATA code</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {!!data.length &&
                        data.map((row, idx) => (
                            <TableRow key={row.name + idx}>
                                <TableCell component='th' scope='row'>{row.name}</TableCell>
                                <TableCell align='right'>{row.subType}</TableCell>
                                <TableCell align='right'>{row.address.cityName}</TableCell>
                                <TableCell align='right'>{row.address.countryName}</TableCell>
                                <TableCell align='right'>{row.address.countryCode}</TableCell>
                                <TableCell align='right'>{row.iataCode}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>

            </Table>

            {/* Will display this if no data in rtesponse from server */}
            {!data.length && <div className="center">No data</div>}

            {/* Pagination Component */}
            <TablePagination
                rowsPerPage={10}
                rowsPerPageOptions={[]}
                component="div"
                count={meta.count ? meta.count: 0}
                page={props.search.page}
                onPageChange={(e, page) => {
                    props.setSearch(p => ({...p, page}))
                }}
            />
        </Paper>
    )
}
