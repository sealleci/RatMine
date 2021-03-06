document['zh_cn_text'] = {
    "ui": {
        "title_shu": "鼠",
        "title_lei": "雷",
        "tool_bar_back": "返回",
        "tool_bar_pause": "暂停",
        "tool_bar_resume": "继续",
        "tool_bar_music": "音乐",
        "tool_bar_sfx": "音效",
        "tool_bar_help": "帮助",
        "menu_play": "开始游戏",
        "menu_set": "设置",
        "menu_baike": "百科",
        "menu_dev": "开发者信息",
        "play_chuang": "闯关模式",
        "play_sandbox": "沙盘模式",
        "play_cici": "贪吃鼠",
        "chuang_title": "闯关模式",
        "chuang_edge": "边格数",
        "chuang_mine": "雷数",
        "chuang_mine_perc": "雷占比",
        "chuang_confirm": "确认",
        "set_game": "游戏设置",
        "set_key": "按键设置",
        "set_lang": "语言",
        "set_music": "音乐",
        "set_sfx": "音效",
        "set_flag": "是否自动标棋",
        "set_toggle": "切换主动被动",
        "set_use": "使用主动",
        "set_blink": "闪现",
        "baike_item": "道具图鉴",
        "baike_chara": "角色图鉴",
        "baike_dialog": "对话记录",
        "baike_manual": "游戏说明",
        "baike_item_type": "道具类型",
        "baike_item_stack": "能否堆叠",
        "baike_use": "使用说明",
        "baike_use_0": "冷却时间{}秒",
        "baike_use_1": "每关可使用{}次",
        "baike_use_2": "没有使用次数限制",
        "baike_use_3": "一次性",
        "baike_chara_type": "角色类型",
        "baike_life": "生命值",
        "dev_depend": "所用依赖项",
        "dev_paint_tool": "绘图工具",
        "dev_program_tool": "开发工具",
        "dev_thank": "鸣谢",
        "rat_score": "鼠分",
        "rat_time": "鼠时",
        "rat_mine": "鼠雷",
        "rat_level": "关卡鼠",
        "item_bar_active": "主动",
        "item_bar_passive": "被动"
    },
    /*
    "type": "0是被动，1是主动",
    "use": "0是时间间隔限制，1是使用次数限制，2是无限制，3是一次性",
    "stackable": "true为可叠加，false为不可"
     */
    "item": {
        "fox_plaster": {
            "name": "狐皮膏药",
            "type": 0,
            "desc": "每堆叠一层道具，将被狙击鼠或穿杨鼠射中后的光标复原时长减半。<br>附注：<br>1. 被狙击鼠射中后的恢复时长初始为3秒；<br>2. 被穿杨鼠射中后的恢复时长初始为5秒。",
            "resume": "减少中弹后的复原时长。",
            "stackable": true
        },
        "puxi_mop": {
            "name": "噗嘻墩布",
            "type": 0,
            "desc": "获得一位猫猫跟班，其名为“噗嘻”。<br>其能捕鼠，对于不同种类的老鼠，处刑时间各不同：<br>1. 小鼠，需要1秒；<br>2. 大鼠，需要2秒；<br>3. 狙击鼠，需要4秒；<br>4. 穿杨鼠，需要5秒。",
            "resume": "获得能捉鼠的跟班“噗嘻”。",
            "stackable": false
        },
        "fur_chip": {
            "name": "福瑞鼠片",
            "type": 0,
            "desc": "每堆叠一层道具，使商店的出售栏位增加1，购买次数上限增加1。<br>附注：<br>1. 商店的出售栏位初始为3；<br>2. 购买次数上限初始为2。",
            "resume": "商店扩容，购买上限增1。",
            "stackable": true
        },
        "pug_bone": {
            "name": "一只肉骨头",
            "type": 0,
            "desc": "获得一位哈巴狗跟班，其名为“巴适”。<br>其能在翻过的非雷格子上刨土，刨土的时间间隔为10秒。<br>能刨出的东西有：<br>1. 鞋带，没有价值；<br>2. 马铃鼠，获得10分；<br>3. 漆盒，获得一个道具，一关只会出一个漆盒。",
            "resume": "获得会刨土的跟班“巴适”。",
            "stackable": false
        },
        "leci_controller": {
            "name": "无鼠机鼠柄",
            "type": 0,
            "desc": "获得一位无鼠机跟班，其名为“乐词”。<br>在每一关，其能使前三次所翻到的雷无效化，被无效化的雷不会执行扣分操作。",
            "resume": "获得能警告翻雷的跟班“乐词”。",
            "stackable": false
        },
        "rat_curse": {
            "name": "大鼠诅咒",
            "type": 0,
            "desc": "出没的小鼠均变成大鼠，出没的狙击鼠均变成穿杨鼠。<br>每堆叠一层道具，分数倍率增加1，大鼠的出没的间隔减半，穿杨鼠的出没概率增加0.2。<br>附注：<br>1. 小鼠与大鼠的出没间隔初始为20秒；<br>2. 狙击鼠与穿杨鼠的出没判定初始为每10秒有0.4的概率出没。",
            "resume": "分数倍率加1，老鼠更为凶猛。",
            "stackable": true
        },
        "rat_baobasin": {
            "name": "聚鼠宝盆",
            "type": 0,
            "desc": "每堆叠一层道具，获得150分数，分数倍率增加0.1。",
            "resume": "获得150分，分数倍率小幅增加。",
            "stackable": true
        },
        "rat_hulu": {
            "name": "丐鼠葫芦",
            "type": 0,
            "desc": "设堆叠道具的层数为n，所翻开的非雷格子的分值为：(0+n)/5。",
            "resume": "翻开的非雷格子能加分。",
            "stackable": true
        },
        "rat_rigui": {
            "name": "良辰鼠晷",
            "type": 0,
            "desc": "每堆叠一层道具，使时间奖励的时限变为当前值的1.2倍。",
            "resume": "延长时间奖励的时限。",
            "stackable": true
        },
        "rat_taofu": {
            "name": "好鼠桃符",
            "type": 0,
            "desc": "每堆叠一层道具，狙击鼠与穿杨鼠的出现概率减半，事件的发生概率减半，提示的出现间隔变为当前值的0.75倍。<br>附注：<br>1. 狙击鼠与穿杨鼠的出没判定初始为：每10秒有0.4的概率出没；<br>2. 事件的发生判定初始为：每关有0.4的概率发生；提示的时间间隔初始为30秒。",
            "resume": "狙击鼠事件的发生频率降低。",
            "stackable": true
        },
        "rat_candua": {
            "name": "灶鼠糖瓜",
            "type": 0,
            "desc": "每堆叠一层道具，商店物品的出售价格变为当前值的0.75倍。",
            "resume": "降低商店价格。",
            "stackable": true
        },
        "tusun_sachet": {
            "name": "狲爷香囊",
            "type": 0,
            "desc": "每堆叠一层道具，小鼠与大鼠的出现间隔增加5秒。<br>附注：小鼠与大鼠的出没间隔初始为20秒。",
            "resume": "老鼠出现频率降低。",
            "stackable": true
        },
        "rat_pounder": {
            "name": "小鼠捣杵",
            "type": 1,
            "desc": "使用后，将一片边格长为2的区域销毁，每销毁一格可以获得3分。",
            "resume": "使用后销毁一片区域并获得分数。",
            "use": 0,
            "cold_down": 25000,
            "stackable": false
        },
        "vine_fiber": {
            "name": "藤蔓纤维",
            "type": 1,
            "desc": "使用后，下次所标的旗帜会变成藤蔓旗帜。藤蔓旗帜每隔6秒，会向周围蔓延一格，其只会蔓延到未被翻开的格子上。<br>藤蔓效果如下：<br>1. 被藤蔓覆盖的格子不会被老鼠翻开；<br>2. 格子附近会提供氧气；<br>3. 藤蔓会因毒雾而无法蔓延。",
            "resume": "使用后所标的旗会长出藤蔓。",
            "use": 2,
            "stackable": false
        },
        "jiao_tv": {
            "name": "银鲛电视",
            "type": 1,
            "desc": "使用后，游戏画面中会出现一台电视，点击电视可以游玩贪吃鼠。贪吃鼠只有一条命。<br>在贪吃鼠中获得的分数能转换为鼠雷中的分数。",
            "resume": "使用后可游玩贪吃鼠来获得分数。",
            "use": 1,
            "times": 1,
            "stackable": false
        },
        "rat_yutou": {
            "name": "鼢鼠蹲鸱",
            "type": 1,
            "desc": "使用后，在接下来的3次点击中：<br>1. 若翻到的是雷，则分数增加20；<br>2. 若翻到的不是雷，则分数减少5。",
            "resume": "使用后的3次点击中，翻雷加分，翻非雷扣分。",
            "use": 0,
            "cold_down": 35000,
            "stackable": false
        },
        "comego_que": {
            "name": "来去之鹊",
            "type": 1,
            "desc": "一次性，每关只能使用一次。使用后能在保留当前分数的情况下，重开当前关卡。<br>可重复获得此道具。",
            "resume": "一次性。使用后保留分数，重开关卡。",
            "use": 3,
            "stackable": true
        },
        "tazi_nose": {
            "name": "獭子鼻子",
            "type": 1,
            "desc": "使用后，可以放置一条獭子多多，其能吸引小鼠、大鼠、狙击鼠与穿杨鼠的注意力，各类老鼠在对獭子多多造成伤害后会离开。<br>獭子多多的生命值初始为10，在生命值降为零后会跑走。<br>各类老鼠对獭子多多所造成的伤害为：<br>1. 小鼠：1点伤害；<br>2. 大鼠：2点伤害；<br>3. 狙击鼠：4点伤害；<br>4. 穿杨鼠：5点伤害。",
            "resume": "使用后放置一条獭子多多来诱骗老鼠。",
            "use": 1,
            "times": 4,
            "stackable": false
        }
    },
    "event": {
        "event": "事件",
        "toxic_mist": {
            "name": "瘴雾"
        },
        "earth_quake": {
            "name": "地震"
        },
        "flood": {
            "name": "泛洪"
        },
        "infinity": {
            "name": "时间永恒"
        },
        "rat_attack": {
            "name": "鼠鼠空袭"
        },
        "snipper_party": {
            "name": "狙击鼠开会"
        },
        "ghost_coming": {
            "name": "鼠魂不散"
        }
    },
    "dialog": {
        "rat_shop_keeper": {
            "default_dialog": [
                "来的都是客，卖的都是货。",
                "日近斗金，月入升银。",
                "门可罗雀？那雀儿确实不怕人。",
                "奶酪不如大米，大米不如灯油。",
                "我管汉堡叫馒塔，比萨叫丰馕。",
                "小小老鼠去开店，老猫来了不加钱。",
                "市列珠玑，户盈罗绮，竞豪奢。",
                "有一天，我和老狗老猫一起比谁的鼻子大。老狗把气一憋，鼓得鼻子老大。老猫拿来两根葱，撑得鼻子老大。我尾巴一翘，搔它俩的痒。把它俩整笑，破了它俩的伎俩后，我的鼻子就是最大的了。",
                "人可以不来，但钱要留下。",
                "铜钱穿红线，盘缠十百千。",
                "银元吹得响，宝贝从天降。"
            ],
            "item_dialog": {
                "fox_plaster": [
                    "患玉病，贴玉药。",
                    "专治双节棍造成的瘀伤。",
                    "有限大暗是谁？我不知道啊。",
                    "臭姑姑，大青虫，长腿蛛，还有数不尽的水猴子。"
                ],
                "puxi_mop": [
                    "带着桶和墩布，因为猫猫会戏水。",
                    "著名女歌手咔嘀D曾说过：“一颗老鼠粪能毁掉一锅通心粉。”",
                    "大脸猫对大鼻子狗说：“你的鼻子可真够大的！”",
                    "老鼠碰到水后，就变成了水豚，这河里吗？"
                ],
                "fur_chip": [
                    "其实鼠鼠也算福瑞。",
                    "超级鼠片，一口一个脆，都是我爱吃吃的。",
                    "我喜欢福瑞，喜欢鼠片，更喜欢福瑞鼠片！",
                    "桂花味儿的，来一口不？"
                ],
                "pug_bone": [
                    "巴哥对八哥说：“为什么你会飞，而我只能当一条哈巴狗？”",
                    "八哥对巴哥说：“哈巴去开大巴士，轧得老鼠吱吱吱！”",
                    "眼睛黑黝黝，想吃哈巴狗~",
                    "巴适，安逸呦！"
                ],
                "leci_controller": [
                    "海豹对着海报说：“如果我被二向箔攻击，我就变得和你一样啦。”",
                    "为什么温州的老鼠喜欢宋词？因为温州的老鼠都是乐词。",
                    "海豹吃水潺，蝤蛑和黄鳝。",
                    "海豹被封印了，变成了海报。"
                ],
                "rat_curse": [
                    "会摆出“耶”这个手势的的老鼠，便是“耶鼠”。",
                    "为什么会有这么多老鼠，你有什么头绪吗？",
                    "感觉要被吸入惹。",
                    "大灰耗子爱上了小白鼠，但一只去了实验组，另一只去了对照组。"
                ],
                "rat_baobasin": [
                    "真是老鼠一箩筐。",
                    "灯能聚光，盆能聚鼠。",
                    "这是鼎吧，不是锅吧。",
                    "逮住赖鼠，攥出尿来。"
                ],
                "rat_hulu": [
                    "鞋儿破，帽儿破，身上的袈裟破~",
                    "酒肉穿肠过，佛鼠心中留。",
                    "这葫芦是由一位老爷爷和一只穿山甲种出来的。",
                    "醉鼠之意不在酒，在乎灯油之间也。"
                ],
                "rat_rigui": [
                    "在子时，老鼠一般会睡大觉。",
                    "应是良辰好景虚设。",
                    "铁子，这是“良辰鼠晷”，可不是“良辰出轨”。",
                    "大鼠小鼠，灌死老鼠！"
                ],

                "rat_taofu": [
                    "人若读到一本醍醐灌顶的书，则会不禁称叹道：好鼠，好鼠！",
                    "神荼在左，郁垒在右。",
                    "是神荼，不是神鼠。",
                    "这是桃子味的吗？"
                ],
                "rat_candua": [
                    "用糖瓜把灶王爷的嘴巴黏住，灶王爷就告不了状了。",
                    "你还可以用这个把我的嘴巴黏上，这样你就能大胆讲价咯。",
                    "糖瓜，脆啊！我喜欢吃脆脆的东西，一口一嘎吱。",
                    "蜜三刀也不错，我也很喜欢吃吃。"
                ],
                "tusun_sachet": [
                    "兔狲的味道，老鼠都不想知道。",
                    "狲爷把腿一收，就会变成兔子？",
                    "真是沁人心脾的味道，我恨不得把自己的鼻子摘掉。",
                    "为什么兔狲的专辑迟迟不发布？因为too soon。"
                ],
                "rat_pounder": [
                    "布谷鸟怎么叫？光棍得杵，光棍得杵。",
                    "用来捣蒜蓉可方便了，再做个蒜蓉油碟，恁香啊。",
                    "为什么老鼠的鸡蛋怕杵子？因为会变成捣蛋鼠。",
                    "躲得过杵一，躲不过十五。"
                ],
                "vine_fiber": [
                    "菟丝附女萝。",
                    "我店外墙壁上的爬山虎，都不如这个长得茂盛。",
                    "现在还用自己动手捻麻线吗？",
                    "我小时候曾被剌剌秧剌过，真是坏东西。"
                ],
                "jiao_tv": [
                    "看这个电视的时候不要哭，因为流的都是珍珠。",
                    "银鲛也算鲨鲨。",
                    "嘿嘿，市面上已经鲜有这种大屁股电视机了。",
                    "屏幕圆圆的，像不像舷窗？在那黄色潜水艇里~"
                ],
                "rat_yutou": [
                    "卖芋头了，卖芋头了，乾隆爷爱吃的芋头呦！",
                    "猫头鹰小小，芋头泥少少。",
                    "点个芋泥波波奶茶的外卖，半糖去冰。",
                    "老鼠在地里挖洞，挖着挖着挖出了山药，然后老鼠变成了痒痒鼠。"
                ],
                "comego_que": [
                    "为什么你会得到一个π？因为喜鹊是卖个π。",
                    "动作快点，不然就被夹去了！",
                    "鹊儿哥不仅能桥接，还能路由。",
                    "为什么路一直铺不完？因为将路铺好的瞬间就loop了。"
                ],
                "tazi_nose": [
                    "獭子哥可以用鼻子哼歌，砍油踹？",
                    "摸摸你的鼻子，小心被摘掉。",
                    "獭子会游，老鼠会跑。",
                    "鼻子还能用来吃炒粉干。"
                ]
            }
        }
    },
    "chara": {
        "rat_shop_keeper": "店老鼠",
        "puxi": "噗嘻",
        "leci": "乐词",
        "tazi_lot": "獭子多多",
        "big_rat": "大鼠",
        "lil_rat": "小鼠",
        "rat_snipper": "狙击鼠",
        "rat_sheshou": "穿杨鼠",
        "rat_ghost": "跑得飞"
    }
}