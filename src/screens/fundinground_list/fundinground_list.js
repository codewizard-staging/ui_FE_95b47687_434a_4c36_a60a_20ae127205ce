
import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataList } from '../childs';
import * as Api from "shared/services";
import { SearchInput, ToggleButtons } from "components";
import { Add as AddBoxIcon } from '@mui/icons-material';
import Helper from "shared/helper";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");

    const NavigateTo = useNavigate();

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }


                                
    const FetchResults = async () => {
        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        await Api.GetFundingRoundsCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                    console.log(res.values);
                } else {
                    console.log(res.statusText);
                }
            });

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [];


        global.Busy(true);
        
        await Api.GetFundingRoundsMulti(query, "StartupLogoIcon").then(async (resP) => {
            if (resP.status) {
                for (let i = 0; i < resP.values.length; i++) {
                    let _FundingRound = resP.values[i];
                    let _row = {
                        prop1: _FundingRound.RoundType,
                        prop2: _FundingRound.FundedStartup?.Name,
                        prop3: _FundingRound.Status,
                        prop4: _FundingRound.PostValuation,
                        prop5: _FundingRound.TargetAmount,
                    };

                    _FundingRound.StartupLogoIcon &&
                        await Api.GetDocumentSingleMedia(_FundingRound.StartupLogoIcon.DocId, true, null).then((resI) => {
                            _row = { ..._row, logo: resI.values };
                        })

                    _rows.push(_row);
                }
            }
        });

        setRows(_rows);
        global.Busy(false);
    }


    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [pageInfo]);

    useEffect(() => { setInitialize(true); }, []);

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%', paddingBottom: 5 }}>
                    <Typography noWrap variant="subheader" component="div">
                        {title}
                    </Typography>
                    <Stack direction="row">
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                                                                                    <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="Add"
                                sx={{
                                    marginLeft: "2px",
                                    borderRadius: "4px",
                                    border: theme.borderBottom
                                }}
                                onClick={() => NavigateTo("/FundingRounds/create")}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Box style={{ width: '100%' }}>
                    <DataList rowsCount={rowsCount} rows={rows} pageInfo={pageInfo} onPageClicked={OnPageClicked} />
                </Box>
            </Container>
        </>

    );

};

export default Component;