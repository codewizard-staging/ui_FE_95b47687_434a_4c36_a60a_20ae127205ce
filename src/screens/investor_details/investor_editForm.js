import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import RenderFormContols from "./child/formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";

const Component = (props) => {
    const { title } = props;
    const [form, setForm] = useState(null);
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [row, setRow] = useState({});
    const [backRow, setBackupRow] = useState({});
    const [showUpdate, setShowUpdate] = useState(false);
    const [dropDownOptions, setDropDownOptions] = useState([]);

    const TrackChanges = (name) => {
        const source = JSON.parse(JSON.stringify(backRow[name]));
        const target = JSON.parse(JSON.stringify(row[name]));

        let changes = [];
        for (let prop of source) {
            let value1 = source.find((x) => x.key === prop.key).value ?? "";
            let value2 = target.find((x) => x.key === prop.key).value ?? "";

            if (value1.toString() !== value2.toString()) {
                changes.push(prop.key);
            }
        }

        return changes;
    }

    const UpdateBackUp = (name) => {
        if (name) {
            let obj = Helper.CloneObject(row[name]);
            let bItems = [];
            for (let prop of obj) {
                bItems.push({ key: prop.key, value: prop.value });
            }
            setBackupRow((prev) => ({ ...prev, [name]: bItems }));
            setState(!state);
        }
    }

    const OnSubmit = async () => {
        let rslt, data, changes = [], investorId, investor, numfields;

        investor = row['investor'];
        investorId = row['investor'].find((x) => x.type === 'keyid').value;

        for (let i = 0; i < MapItems.length; i++) {
            // Check is there any changes
            const mapItem = MapItems[i];

            if (!Helper.IsJSONEmpty(mapItem.navpropname)) {
                changes = TrackChanges(mapItem.uicomponent);
                if (changes.length > 0) {
                    // Check any excluded items are configured
                    let tmp = changes.filter((x) => mapItem.exclude.indexOf(x) === -1);
                    if (tmp.length > 0) {
                        let newObject = row[mapItem.uicomponent];
                        numfields = Helper.GetAllNumberFields(newObject);
                        if (numfields.length > 0) Helper.UpdateNumberFields(newObject, numfields);
                        rslt = await mapItem.func(newObject, dropDownOptions, mapItem.exclude);
                        if (rslt.status) {
                            newObject.find((x) => x.type === 'keyid').value = rslt.id;
                            if (Helper.IsNullValue(mapItem.navpropname)) investorId = rslt.id;
                            
                            const mapPropKey = product.find(x => x.uicomponent === mapItem.uicomponent).key;
                            data = [
                                { key: "InvestorId", value: parseInt(investorId) },
                                { key: mapPropKey, value: parseInt(rslt.id) }
                            ];
                            rslt = await Support.AddOrUpdateInvestor(data, dropDownOptions);
                            if (!rslt.status) return;                            

                            // Update Back for next tracking purpose
                            UpdateBackUp(mapItem.target);
                        } else { return; }
                    }
                }
            }

        }

        
                                                                                                                                                        
                                                
                                                

        global.AlertPopup("success", "Investor is updated successfully!");
        setShowUpdate(false);
        NavigateTo(-1);
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name && x.type !== "keyid");
        if (_index > -1) {
            const item = _row[location][_index];
            let tValue = Helper.IsNullValue(value) ? null : value;
            if (tValue === 'CNONE') tValue = null;
            _row[location][_index].value = value;
            setRow(_row);
            setShowUpdate(true);
            if (!Helper.IsNullValue(item['mapitem'])) {
                UpdateMappingPannel(_row, item, tValue);
            }
        }
    }

    const UpdateMappingPannel = (_row, item, value) => {

        const { mapitem, source, valueId } = item;
        const { Values } = dropDownOptions.find(x => x.Name === source);
        const obj = value ? Values.find(x => x[valueId] === value) : null;
        let _rowMap = _row[mapitem] || [];

        for (let i = 0; i < _rowMap.length; i++) {

            let tmpField = _rowMap[i];
            let bEditable = true;
            let _cValue = null;

            if (!Helper.IsNullValue(obj)) {
                _cValue = obj[tmpField.key];
                if (tmpField.type === 'dropdown') {
                    const _dValues = dropDownOptions.find(x => x.Name === _rowMap[i].source).Values;
                    _cValue = _dValues.find(x => x.Name === _cValue)[_rowMap[i].valueId];
                } else if (tmpField.type === 'date') {
                    _cValue = Helper.ToDate(_cValue, "YYYY-MM-DD");
                }
                bEditable = false;
            }

            tmpField.editable = bEditable;
            tmpField.value = _cValue;

            _rowMap[i] = tmpField;

        }
        if (_row[mapitem]) _row[mapitem] = _rowMap;
        setRow(_row);
        setState(!state);
    };

    const fetchData = async () => {

        await Extract(id).then(rslt => {
            const { row, options, backRow } = rslt;
            setRow(row);
            setDropDownOptions(options);
            setBackupRow(backRow);
            setState(!state);
        })

    };

    if (initialized) { setInitialized(false); fetchData(); }

    useEffect(() => { setInitialized(true); }, [id]);

    return (

        <>
            <Container {...props}>
                <Box style={{ paddingBottom: 4, width: "100%" }}>
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "100%" }}>
                            <Typography noWrap variant="subheader" component="div">
                                {title}
                            </Typography>
                        </Box>
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" startIcon={<ArrowLeftIcon />}
                                onClick={() => NavigateTo(-1)}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols {...props} shadow={true} setForm={setForm} mode={"edit"} controls={row} options={dropDownOptions}
                    onInputChange={OnInputChange} onSubmit={OnSubmit} />

                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                <Button variant="contained" onClick={(e) => OnSubmitForm(e)}>Update</Button>
                                <Button variant="outlined" onClick={() => NavigateTo(-1)}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container>
        </>

    );

};

export default Component;
