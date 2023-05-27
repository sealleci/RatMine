var lang_root_dir = './lang';
var lang_dir = 'zh_cn';
var item_file = 'text.js';
var img_root_dir = './img';

function readItemInfo(cur_lang) {
    let item_json = document[cur_lang]['item'];
    let ui_json = document[cur_lang]['ui'];
    for (let key in item_json) {
        $('#baike-item-list').append(
                $(`
                    <div class="baike-item">
                        <div class="baike-item-img">
                            <img src="${img_root_dir}/${key}.svg" />
                            <div class="baike-item-name">${item_json[key]['name']}</div>
                        </div>
                        <div class="baike-item-info">
                            <div class="item-type">
                                <span>类型</span>
                                <span>${item_json[key]['type']==0?"被动":"主动"}</span>
                            </div>
                            <div class="item-stack">
                                <span>能否堆叠</span>
                                <span>${item_json[key]['stackable']?"是":"否"}</span>
                            </div>
                            <div class="item-desc">${item_json[key]['desc']}</div>
                            ${
                                item_json[key]['type']==1?`
                                    <div class="item-use">
                                        <span>使用说明</span>
                                        <span>
                                            ${
                                                item_json[key]['use']==0?ui_json['baike_use_0'].replace('{}',Math.floor(item_json[key]['cold_down']/1000)):
                                                item_json[key]['use']==1?ui_json['baike_use_1'].replace('{}',item_json[key]['times']):
                                                item_json[key]['use']==2?ui_json['baike_use_2']:
                                                ui_json['baike_use_3']
                                            }
                                        </span>
                                    </div>`:
                                ""
                            }
                        </div>
                    </div>
                `
            )
        );
    }
}
$(function() {
    let cur_lang = `${lang_dir}_text`;
    readItemInfo(cur_lang);
})