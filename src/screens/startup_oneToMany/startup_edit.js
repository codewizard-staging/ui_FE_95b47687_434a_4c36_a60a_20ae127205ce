import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import RenderFormContols from "./child/formcontrols";
import { useNavigate, useParams } from "react-router-dom";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";

const numberItems = ['Pincode'];

const Component = (props) => {

    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [backRow, setBackupRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const [childCollections, setChildCollections] = useState([]);

        const [startupFounders, setStartupFounders] = useState([]);

    const NavigateTo = useNavigate();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;

    const TrackChanges = (name) => {
        if (Helper.IsNullValue(backRow[name])) return [];
        const source = JSON.parse(JSON.stringify(backRow[name]));
        const target = JSON.parse(JSON.stringify(row[name]));

        let changes = [];
        for (let prop of source) {
            let value1 = source.find((x) => x.key === prop.key).value ?? "";
            let value2 = target.find((x) => x.key === prop.key).value ?? "";

            if (prop.key === 'Logo') {
                value1 = value1.DocName ?? "";
                value2 = value2.DocName ?? "";
            }
            if (value1.toString() !== value2.toString()) {
                changes.push(prop.key);
            }
        }

        return changes;
    }

    const OnSubmit = async () => {
        let rslt, data, prodImages, startupId, changes, numfields;
        const mapItems = MapItems;

        // Attach inline objects
        let startup = row['startup'];
        startupId = row['startup'].find((x) => x.type === 'keyid').value;

        let inlineObjs = childCollections.filter(x => !x.child);
        inlineObjs.forEach(x => {
            let vObj = {};
            let obj = row[x.name];
            numfields = Helper.GetAllNumberFields(obj);
            if (numfields.length > 0) Helper.UpdateNumberFields(obj, numfields);
            const tmp = Object.values(obj);
            tmp.filter((x) => x.value).map((x) => {
                if (x.type === 'dropdown' && !Helper.IsNullValue(x.value)) {
                    vObj[x.key] = dropDownOptions.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                } else if (numberItems.indexOf(x.key) > -1) {
                    if (x.value) vObj[x.key] = parseFloat(x.value);
                } else {
                    vObj[x.key] = x.value;
                }
            });
            startup.push({ key: x.property, value: vObj, type: "inline" });
        });

        // Add or Update Collection Items
        let updateChild = [];
        inlineObjs = childCollections.filter(x => x.child) || [];
        inlineObjs.forEach(x => {
            let _org = row[x.name];
            let _obj = row[x.name].find(z => z.type === 'keyid');
            let _values = _obj?.values;
            let _keyId = _obj?.key;
            let filterRowItems = Helper.CloneObject(_values).filter(x => ['add', 'edit', 'delete'].indexOf(x.action) > -1);
            let valueList = [];
            filterRowItems.forEach(m => {
                delete m['id'];
                switch (m['action']) {
                    case 'add': break;
                    case 'edit': m.Edited = true; break;
                    case 'delete': m.Deleted = true; break;
                }
                if (m['action'] === 'delete') {
                    m.Deleted = true;
                } else if (m['action'] === 'add') {
                    delete m[_keyId];
                }
                delete m['id'];
                delete m['action'];
                
                let oValues = Object.keys(m);
                let newFldList = [];
                oValues.forEach(z => {
                    let fld = _org.find(k => k.key === z);
                    if (fld) {
                        fld.value = m[z];
                        if (fld.type === 'dropdown' && !Helper.IsNullValue(fld.value)) {
                            fld.value = dropDownOptions.find((z) => z.Name === fld.source).Values.find((k) => k[fld.nameId] === fld.value)[fld.valueId];
                            if (fld.enum) {
                                fld.value = fld.value?.toString();
                            }
                        }
                        newFldList.push(fld);
                    }
                });

                numfields = Helper.GetAllNumberFields(newFldList);
                if (numfields.length > 0) Helper.UpdateNumberFields(newFldList, numfields);

                let tmp2 = {};

                newFldList.forEach(j => {
                    tmp2 = { ...tmp2, [j.key]: j.value };
                });

                updateChild.push(tmp2);

            });

        });

        if (inlineObjs.length === 0) {
            global.AlertPopup("error", "Atleaset one child item should exist!");
            return;
        }


        // Add Or Update Startup
        changes = TrackChanges('startup');
        if (changes.length > 0) {
            numfields = Helper.GetAllNumberFields(startup);
            if (numfields.length > 0) Helper.UpdateNumberFields(startup, numfields);
            rslt = await Support.AddOrUpdateStartup(startup, ['Logo',]);
            if (rslt.status) {
                startupId = rslt.id;
            } else { return; }
        }

        
        

        let bAllStatus = false;
        for (let i = 0; i < updateChild.length; i++) {
            let _data = updateChild[i];
                        let FoundersStartupMapId = null;
            if (_data.Deleted && !Helper.IsNullValue(_data.FId)) {
                FoundersStartupMapId = startupFounders.find(x => x.FId === _data.FId && x.SId === startupId).Id;
            }
            rslt = await Support.AddOrUpdateStartupFounders(FoundersStartupMapId, startupId, _data);
            bAllStatus = !bAllStatus ? rslt.status : bAllStatus;
        }

        if (!bAllStatus && updateChild.length > 0) {
            global.AlertPopup("error", "Somthing went wrong to update!");
            return;
        }

        for (let i = 0; i < mapItems.length; i++) {

            // Check is there any changes
            const mapItem = MapItems[i];
            changes = TrackChanges(mapItem.uicomponent);

            if (changes.length > 0) {
                // Add or Update the Startup and navigation entity if it is deos not exist
                let navItem = startup.find(x => x.uicomponent === mapItems[i].uicomponent);
                if (!Helper.IsJSONEmpty(navItem) && Helper.IsNullValue(navItem.value)) {
                    let childItem = row[navItem.uicomponent];
                    numfields = Helper.GetAllNumberFields(childItem);
                    if (numfields.length > 0) Helper.UpdateNumberFields(childItem, numfields);

                    rslt = await mapItems[i].func(childItem, dropDownOptions);
                    if (rslt.status) {
                        data = [
                            { key: "SId", value: parseInt(startupId) },
                            { key: navItem.key, value: parseInt(rslt.id) }
                        ];
                        rslt = await Support.AddOrUpdateStartup(data);
                        if (!rslt.status) return;

                        // Update Back for next tracking purpose
                        UpdateBackUp(mapItem.target);

                    } else { return; }
                }
            }
        }

                    
        
        // Add or Update Startup Logo
        changes = TrackChanges('startup');
        if (changes.length > 0 && changes.indexOf('Logo') > -1) {
            prodImages = startup.find((x) => x.key === 'Logo');
            if (prodImages && !Helper.IsNullValue(prodImages.value)) {
                rslt = await Support.AddOrUpdateDocument(prodImages);
                if (rslt.status) {
                    data = [
                        { key: "SId", value: parseInt(startupId) },
                        { key: "StartupLogo", value: parseInt(rslt.id) }
                    ];
                    rslt = await Support.AddOrUpdateStartup(data);
                    if (!rslt.status) return;
                } else { return; }
            }
        }
            
        

        global.AlertPopup("success", "Startup is created successfully!");
        setShowUpdate(false);
        NavigateTo(-1);
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

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name && x.type !== "keyid");
        if (_index > -1) {
            const item = _row[location][_index];
            let tValue = Helper.IsNullValue(value) ? null : value;
            if (tValue === 'CNONE') tValue = null;
            _row[location][_index].value = tValue;
            setRow(_row);
            setShowUpdate(true);
            if (!Helper.IsNullValue(item['uicomponent'])) {
                UpdateMappingPannel(_row, item, tValue);
            }
        }
    }

    const UpdateMappingPannel = (_row, item, value) => {

        const { uicomponent, source, valueId } = item;
        const { Values } = dropDownOptions.find(x => x.Name === source);
        const obj = value ? Values.find(x => x[valueId] === value) : null;
        let _rowMap = _row[uicomponent] || [];

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
        if (_row[uicomponent]) _row[uicomponent] = _rowMap;
        setRow(_row);
        setState(!state);
    };

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const fetchData = async () => {
        await Extract(id).then(rslt => {
            const { row, options, collections, mapitems, backRow } = rslt;
            console.log(mapitems);
            setRow(row);
            setChildCollections(collections);
            setDropDownOptions(options);
                        setStartupFounders(mapitems)
            setBackupRow(backRow);
            setState(!state);
        })
    };

    const OnTableRowUpdated = (e) => {
        const { location, items } = e;
        let _row = { ...row };
        _row[location].find(x => x.type === 'keyid').values = items;
        setRow(_row);
        setShowUpdate(true);
    }

    useEffect(() => { setShowButton(true); }, []);
    if (initialized) { setInitialized(false); fetchData(); }
    useEffect(() => { setInitialized(true); }, [id]);

    return (

        <>
            <Container {...props}>
                <Box sx={{ width: '100%', height: 50 }}>
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
                <RenderFormContols shadow={true} {...props} setForm={setForm} onInputChange={OnInputChange} onTableRowUpdated={OnTableRowUpdated}
                    controls={row} onSubmit={OnSubmit} options={dropDownOptions} />
                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                {showButton && <Button variant="contained" onClick={(e) => OnSubmitForm(e)} >Save</Button>}
                                <Button variant="outlined" onClick={() => NavigateTo(-1)}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container >
        </>

    );

};

export default Component;
