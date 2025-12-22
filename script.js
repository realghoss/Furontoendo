// ==========================================
// 0. 頁面切換邏輯 (SPA Navigation)
// ==========================================
function switchPage(pageId) {
    // 1. 隱藏所有頁面區塊
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // 2. 顯示目標區塊
    const targetSection = document.getElementById('section-' + pageId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // 3. 更新導覽列按鈕狀態
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    const activeNav = document.getElementById('nav-' + pageId);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// ==========================================
// 1. 卡片資料庫 (Cards Data)
// ==========================================
const cardsData = [
    { id: 1, name: "妖精之環", class: "elf", cost: 1, atk: "-", hp: "-", image: "https://placehold.co/300x400/1a1a1a/gold?text=Fairy+Circle", desc: "召喚兩個妖精到戰場上。" },
    { id: 2, name: "皇家劍士", class: "royal", cost: 2, atk: "2", hp: "2", image: "https://placehold.co/300x400/1a1a1a/white?text=Royal+Saber", desc: "入場曲：獲得+1/+0。" },
    { id: 3, name: "次元超越", class: "witch", cost: 7, atk: "-", hp: "-", image: "https://placehold.co/300x400/1a1a1a/purple?text=D-Shift", desc: "這回合結束後，進行一個額外的回合。" },
    { id: 4, name: "巴哈姆特", class: "dragon", cost: 7, atk: "9", hp: "9", image: "https://placehold.co/300x400/1a1a1a/red?text=Bahamut", desc: "入場曲：破壞戰場上所有其他卡片。" },
    { id: 5, name: "骷髏士兵", class: "necro", cost: 1, atk: "1", hp: "1", image: "https://placehold.co/300x400/1a1a1a/green?text=Skeleton", desc: "謝幕曲：召喚一個骷髏。" },
    { id: 6, name: "吸血鬼", class: "vampire", cost: 2, atk: "2", hp: "1", image: "https://placehold.co/300x400/1a1a1a/darkred?text=Vampire", desc: "必殺。" },
    { id: 7, name: "天界獵犬", class: "bishop", cost: 2, atk: "2", hp: "2", image: "https://placehold.co/300x400/1a1a1a/yellow?text=Dog", desc: "守護。" },
    { id: 8, name: "古代創造物", class: "nemesis", cost: 1, atk: "3", hp: "1", image: "https://placehold.co/300x400/1a1a1a/blue?text=Artifact", desc: "突進。" },
    { id: 9, name: "哥布林", class: "all", cost: 1, atk: "1", hp: "2", image: "https://placehold.co/300x400/1a1a1a/gray?text=Goblin", desc: "無效果。" },
];

const grid = document.getElementById('card-grid');

// ==========================================
// 2. 卡片渲染邏輯 (Render Logic)
// ==========================================
function renderCards(filterClass = 'all', filterCost = 'all', searchTerm = '') {
    if (!grid) return; // 防止找不到元素時報錯
    grid.innerHTML = '';

    const filtered = cardsData.filter(card => {
        const matchClass = filterClass === 'all' || card.class === filterClass;
        const matchCost = filterCost === 'all' || (filterCost === '7' ? card.cost >= 7 : card.cost == filterCost);
        const matchName = card.name.includes(searchTerm);
        return matchClass && matchCost && matchName;
    });

    filtered.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card-item';
        cardEl.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
        cardEl.addEventListener('click', () => openCardModal(card));
        grid.appendChild(cardEl);
    });
}

// 綁定過濾器事件
const filterClass = document.getElementById('filter-class');
const filterCost = document.getElementById('filter-cost');
const searchInput = document.getElementById('search-input');

if(filterClass && filterCost && searchInput) {
    filterClass.addEventListener('change', (e) => renderCards(e.target.value, filterCost.value, searchInput.value));
    filterCost.addEventListener('change', (e) => renderCards(filterClass.value, e.target.value, searchInput.value));
    searchInput.addEventListener('input', (e) => renderCards(filterClass.value, filterCost.value, e.target.value));
}

// ==========================================
// 3. 統一彈出視窗控制 (Modal Control)
// ==========================================
const cardModal = document.getElementById('card-modal');
const ruleModal = document.getElementById('rule-modal');

// --- A. 卡片視窗邏輯 ---
function openCardModal(card) {
    document.getElementById('modal-img').src = card.image;
    document.getElementById('modal-name').textContent = card.name;
    document.getElementById('modal-class').textContent = card.class.toUpperCase();
    document.getElementById('modal-cost').textContent = card.cost;
    document.getElementById('modal-atk').textContent = card.atk;
    document.getElementById('modal-hp').textContent = card.hp;
    document.getElementById('modal-desc').textContent = card.desc;
    
    if(cardModal) cardModal.style.display = 'flex';
}

// 綁定卡片視窗關閉按鈕
const cardCloseBtn = document.querySelector('#card-modal .close-btn');
if(cardCloseBtn) {
    cardCloseBtn.addEventListener('click', () => {
        cardModal.style.display = 'none';
    });
}

// --- B. 規則視窗邏輯 ---
function openRuleModal(ruleKey) {
    // 需要先定義 rulesData (在下方)，所以這裡會存取全域變數
    const data = rulesData[ruleKey];
    if (data && ruleModal) {
        document.getElementById('rule-modal-title').textContent = data.title;
        document.getElementById('rule-modal-body').innerHTML = data.content;
        ruleModal.style.display = 'flex';
    }
}

// 綁定規則視窗關閉按鈕
const ruleCloseBtn = document.querySelector('#rule-modal .close-btn');
if(ruleCloseBtn) {
    ruleCloseBtn.addEventListener('click', () => {
        ruleModal.style.display = 'none';
    });
}

// --- C. 點擊背景關閉 ---
window.onclick = (e) => {
    if (e.target == cardModal) cardModal.style.display = 'none';
    if (e.target == ruleModal) ruleModal.style.display = 'none';
}

// ==========================================
// 4. 雷達圖功能 (Radar Chart)
// ==========================================
let myRadarChart = null;

function initRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['解場', '打頭', '節奏', '回血', '搓盾'],
            datasets: [{
                label: '能力值',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                borderColor: '#D4AF37',
                borderWidth: 2,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: '#333' },
                    grid: { color: '#333' },
                    pointLabels: { color: '#e0e0e0', font: { size: 14 } },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: { display: false, maxTicksLimit: 6 }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function showRadar(dataArray, deckName) {
    if (!myRadarChart) initRadarChart();
    myRadarChart.data.datasets[0].data = dataArray;
    document.getElementById('chart-title').textContent = deckName + " 能力分析";
    myRadarChart.update();
}

// ==========================================
// 5. 本週熱門卡組功能
// ==========================================
let myWeeklyChart = null;

const weeklyDecksData = {
    'evo-blood': {
        title: '進化吸血鬼 - 戰術解析',
        img: 'https://placehold.co/800x300/1a1a1a/darkred?text=Evo+Blood',
        desc: '這套牌組依靠多次進化來觸發格里姆尼爾的斬殺效果。前期請保留低費解場牌...',
        stats: [3, 4, 3, 5, 2]
    },
    'spell-witch': {
        title: '增幅巫師 - 戰術解析',
        img: 'https://placehold.co/800x300/1a1a1a/purple?text=Spell+Witch',
        desc: '利用法術增幅降費，在第 6-7 回合打出爆發性傷害。需要精確計算手牌上限。',
        stats: [5, 5, 2, 1, 1]
    },
    'loot-sword': {
        title: '財寶皇家 - 戰術解析',
        img: 'https://placehold.co/800x300/1a1a1a/gold?text=Loot+Sword',
        desc: '融合了財寶任務與協作體系，透過「芭芭若薩」進行資源回收與場面壓制。',
        stats: [4, 3, 4, 3, 4]
    }
};

function initWeeklyChart() {
    const ctx = document.getElementById('radarChartWeekly');
    if (!ctx) return;

    myWeeklyChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['解場', '打頭', '節奏', '回血', '搓盾'],
            datasets: [{
                label: '能力值',
                data: [3, 4, 3, 5, 2],
                backgroundColor: 'rgba(234, 42, 51, 0.2)',
                borderColor: '#ea2a33',
                borderWidth: 2,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: '#333' },
                    grid: { color: '#333' },
                    pointLabels: { color: '#e0e0e0' },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: { display: false, maxTicksLimit: 6 }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function updateWeeklyView(element, deckKey) {
    const data = weeklyDecksData[deckKey];
    if (!data) return;

    document.querySelectorAll('#weekly-list li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('weekly-title').textContent = data.title;
    document.getElementById('weekly-img').src = data.img;
    document.getElementById('weekly-desc').textContent = data.desc;

    if (!myWeeklyChart) initWeeklyChart();
    else {
        myWeeklyChart.data.datasets[0].data = data.stats;
        myWeeklyChart.update();
    }
}

// ==========================================
// 6. 規則內容資料庫 (Rules Data)
// ==========================================
const rulesData = {
    'win': {
        title: '勝利條件',
        content: `<p>Shadowverse WB 是一款 1 對 1 的卡牌對戰遊戲。</p><p>雙方主戰者體力皆為 20 點。將對手歸零即可獲勝。</p>`
    },
    'pp': {
        title: 'PP 點數機制',
        content: `<p>PP 每回合回復並增加上限 1 點，最大 10 點。</p>`
    },
    'evo': {
        title: '進化系統',
        content: `<p>先攻第 5 回合 / 後攻第 4 回合可開始進化。</p>`
    },
    'classes': {
        title: '職業特性簡介',
        content: `<ul><li>精靈：連擊</li><li>皇家：協作</li><li>巫師：增幅</li><li>龍族：跳費</li></ul>`
    }
};

// ==========================================
// 7. 初始化執行 (Init)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    initRadarChart();
    initWeeklyChart();
});