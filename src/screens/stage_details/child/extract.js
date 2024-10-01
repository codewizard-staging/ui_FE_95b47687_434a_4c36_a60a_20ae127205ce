import StageJsonConfig from "config/stage_product_details_detail_config.json";
import * as Api from "shared/services";
import Helper from "shared/helper";
import { GetMetaDataInfo } from "shared/common";
import Support from "shared/support";

var fn = {};

const MapItems = [
    { navpropname: "", uicomponent: "stage", expand: "", exclude: [], func: Support.AddOrUpdateStage }
]

const FetchStageInfo = async () => {
    let item = {};
    return new Promise(async (resolve) => {
        const keyItems = Object.keys(StageJsonConfig);
        keyItems.forEach(elm => {
            let items = [];
            for (let prop of StageJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });
        return resolve(item);
    });
}

const FetchStageDetails = async (stageId, enums) => {

    return new Promise(async (resolve) => {
        let item = {}, backItem = {}, tmp;

        const keyItems = Object.keys(StageJsonConfig);

        keyItems.forEach(elm => {
            let items = [];
            for (let prop of StageJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (stageId) {
            global.Busy(true);
            let rslt
            // Get Stage Details
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
            if ($expand.length > 0) {
                rslt = await Api.GetStageSingle(stageId, `$expand=${$expand}`);
            } else {
                rslt = await Api.GetStageSingle(stageId);
            }
            
            if (rslt.status) {

                const stage = rslt.values;

                for (let i = 0; i < MapItems.length; i++) {

                    const source = MapItems[i].navpropname;
                    const target = MapItems[i].uicomponent;

                    const sourceObj = Helper.IsNullValue(source) ? stage : stage[source];

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
                                let tmpDate = sourceObj[prop].split('T');
                                _nValue = tmpDate[0];
                            } else {
                                _nValue = sourceObj[prop];
                            }

                            item[target].find((x) => x.key === prop).value = _nValue;

                        }
                    }

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

        return resolve({ row: item, backRow: backItem });
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

const Extract = async (stageId) => {

    return new Promise(async (resolve) => {

        let rtnObj = { row: {}, options: [], backRow: {} };

        await FetchStageInfo().then(async (item) => {

            rtnObj.row = Helper.CloneObject(item);

            let items = [];
            Object.values(item).forEach(elm => {
                items = [...items, ...elm];
            });
            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));

            await FetchDropdownItems(items).then(async (enums) => {
                rtnObj.options = Helper.CloneObject(enums);
                if (!Helper.IsNullValue(stageId)) {
                    await FetchStageDetails(stageId, enums).then(({ row, backRow }) => {
                        rtnObj.row = Helper.CloneObject(row);
                        rtnObj.backRow = Helper.CloneObject(backRow);
                    })
                }
            });
        });

        return resolve(rtnObj);
    });
}

export { Extract, MapItems };

