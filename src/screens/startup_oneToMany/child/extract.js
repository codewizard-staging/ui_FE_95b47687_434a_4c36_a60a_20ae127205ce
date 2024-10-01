
import StartupJsonConfig from "config/startup_product_onetomany_oneToMany_config.json";
import * as Api from "shared/services";
import Helper from "shared/helper";
import { GetMetaDataInfo } from "shared/common";
import Support from "shared/support";

const MapItems = [



    { navpropname: "", uicomponent: "startup", expand: "Logo,Founders", exclude: ['Logo'], func: Support.AddOrUpdateStartup }
,    { navpropname: "Founders", uicomponent: "founderfounders", expand: "Founders", exclude: [], parent: "startup", child: true }
];

const FetchStartupInfo = async () => {
    let item = {};
    return new Promise(async (resolve) => {
        const keyItems = Object.keys(StartupJsonConfig);
        keyItems.forEach(elm => {
            let items = [];
            for (let prop of StartupJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });
        return resolve(item);
    });
}

const FetchStartupDetails = async (startupId, enums) => {

    return new Promise(async (resolve) => {
        let item = {}, rslt, backItem = {}, tmp;
        
        let startupFounders = [];
        const keyItems = Object.keys(StartupJsonConfig);

        keyItems.forEach(elm => {
            let items = [];
            for (let prop of StartupJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (startupId) {
            global.Busy(true);

                    let rslt = await Api.GetStartupFoundersJoin(startupId);
            if (rslt.status) startupFounders = rslt.values;
            

            // Get Startup Details
            let $expand = [];
            let $expandItems = MapItems.filter(z => z.expand).map(x => x.expand);
            $expandItems.forEach(x => {
                if (x.indexOf(",") > -1) {
                    $expand.push(...x.split(","));
                } else {
                    $expand.push(x);
                }
            })

            $expand = Helper.RemoveDuplicatesFromArray($expand);

            rslt = await Api.GetStartupSingle(startupId, `$expand=${$expand}`);

            if (rslt.status) {

                const startup = rslt.values;

                for (let i = 0; i < MapItems.length; i++) {

                    const source = MapItems[i].navpropname;
                    const target = MapItems[i].uicomponent;
                    const parent = MapItems[i].parent;
                    const child = MapItems[i].child;

                    const sourceObj = Helper.IsNullValue(source) ? startup : startup[source];
                    if (parent && child) {
                        let _tmpItems = [];
                        let _fItem = item[target];//.filter(z => z.type !== 'keyid');
                        sourceObj.forEach(x => {
                            let _tmpItem = {};
                            _tmpItem['id'] = Helper.GetGUID();
                            _fItem.forEach(m => {
                                if (m.type === 'keyid' && !Helper.IsNullValue(x[m.key])) {
                                    _tmpItem['id'] = x[m.key];
                                }
                                let _nValue = x[m.key];
                                if (m.type === 'dropdown') {
                                    const { Values } = enums.find((z) => z.Name === m.source);
                                    const _value = Values.find((z) => z[m.valueId] === _nValue || z[m.contentId] === _nValue) || {};
                                    _nValue = _value[m.contentId];

                                } else if (m.type === 'date') {
                                    let tmpDate = _nValue.indexOf("T") > 0 ? _nValue.split('T') : [_nValue];
                                    _nValue = tmpDate[0];
                                }

                                _tmpItem[m.key] = _nValue;
                            })
                            _tmpItems.push(_tmpItem);
                        });

                        item[target].find((x) => x.type === "keyid").values = _tmpItems;
                    } else {
                        for (let prop in sourceObj) {
                            const tItem = item[target]?.find((x) => x.key === prop);
                            if (tItem && !Helper.IsNullValue(sourceObj[prop])) {

                                let _nValue = null;
                                if (tItem.type === 'dropdown') {
                                    const { Values } = enums.find((z) => z.Name === tItem.source);
                                    const _value = Values.find((m) => m[tItem.contentId] === sourceObj[prop] || m[tItem.valueId] === sourceObj[prop]) || {};
                                    _nValue = _value[tItem.valueId];

                                    if (!Helper.IsNullValue(_nValue) && item[tItem.mapitem]) {
                                        item[tItem.mapitem].forEach(x => x.editable = false);
                                    }

                                } else if (tItem.type === 'date') {
                                    let tmpDate = sourceObj[prop].indexOf("T") > 0 ? sourceObj[prop].split('T') : [sourceObj[prop]];
                                    _nValue = tmpDate[0];
                                } else {
                                    _nValue = sourceObj[prop];
                                }

                                item[target].find((x) => x.key === prop).value = _nValue;

                            }
                        }
                    }

                }

                // Get Startup Logo
                if (startup.Logo) {
                    tmp = {};
                    ['DocData', 
                        'DocId', 
                        'Name', 
                        'Type', 
                        'Description', 
                        'Date'
                    ].forEach((x) => {
                        tmp[x] = startup.Logo[x]
                    });

                    if (tmp.DocId > 0) {
                        rslt = await Api.GetDocumentSingleMedia(tmp.DocId, true);
                        if (rslt.status) tmp['DocData'] = rslt.values;
                    }
                    if (item['startup'].find((x) => x.key === "Logo")) item['startup'].find((x) => x.key === "Logo").value = tmp;
                }
            }

            let bItem = {};
            keyItems.forEach(elm => {
                let bItems = [];
                for (let prop of item[elm]) {
                    bItems.push({ key: prop.key, value: prop.value });
                }
                bItem[elm] = bItems;
            });

            backItem = Helper.CloneObject(bItem);

            global.Busy(false);
        }

                return resolve({ row: item, backRow: backItem, mapitems: startupFounders });
    });
}

const FetchDropdownItems = async (items) => {
    return new Promise(async (resolve) => {

        global.Busy(true);

        // Default get all enums list items
        let res = await GetMetaDataInfo();

        const enums = res.filter((x) => x.Type === 'Enum') || [];
        const otherItems = items.filter(x => enums.findIndex(z => z.Name === x) === -1);

        // Extract the required entities as enums
        for (let i = 0; i < otherItems.length; i++) {
            const item = otherItems[i];
            await Api.GetEntityInfo(item + 's').then(rslt => {
                if (rslt.status) {
                    enums.push({ Name: item, Type: 'Entity', Values: rslt.values });
                }
            });
        }

        global.Busy(false);
        return resolve(enums);
    });
};

const Extract = async (startupId) => {

    return new Promise(async (resolve) => {

        let rtnObj = { row: {}, options: [], backRow: {} };

        await FetchStartupInfo().then(async (item) => {

            rtnObj.row = Helper.CloneObject(item);

            let oKeys = Object.keys(item);

            rtnObj.collections = [];
            Object.values(oKeys).forEach(elm => {
                const { parent, child, property } = item[elm].find(x => x.type === 'keyid');
                if (!Helper.IsNullValue(parent)) {
                    rtnObj.collections.push({ name: elm, parent, child, property });
                }
            });

            let items = [];
            Object.values(item).forEach(elm => {
                items = [...items, ...elm];
            });
            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));

            await FetchDropdownItems(items).then(async (enums) => {
                rtnObj.options = Helper.CloneObject(enums);
                if (!Helper.IsNullValue(startupId)) {
                    await FetchStartupDetails(startupId, enums).then(({ row, backRow, mapitems }) => {
                        rtnObj.row = Helper.CloneObject(row);
                        rtnObj.mapitems = Helper.CloneObject(mapitems);
                        rtnObj.backRow = Helper.CloneObject(backRow);
                    })
                }
            });
        });

        return resolve(rtnObj);
    });
}

export { Extract, MapItems };

