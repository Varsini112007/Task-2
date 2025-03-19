// Generate random OHLC data
function generateRandomData(n) {
    const data = [];
    let date = new Date('2025-01-01');
    for (let i = 0; i < n; i++) {
        const open = Math.random() * (200 - 100) + 100;
        const close = Math.random() * (200 - 100) + 100;
        const high = Math.max(open, close) + Math.random() * 20;
        const low = Math.min(open, close) - Math.random() * 20;
        date.setDate(date.getDate() + 1);
        data.push({
            time: date.getTime() / 1000, // Convert to Unix timestamp
            open: open,
            high: high,
            low: low,
            close: close,
        });
    }
    return data;
}

// Recognize patterns
function recognizePatterns(data) {
    const patterns = [];
    for (let i = 1; i < data.length; i++) {
        const current = data[i];
        const previous = data[i - 1];
        const bodyCurrent = Math.abs(current.close - current.open);
        const bodyPrevious = Math.abs(previous.close - previous.open);
        const candleLength = current.high - current.low;
        const lowerShadowCurrent = Math.min(current.open, current.close) - current.low;
        const upperShadowCurrent = current.high - Math.max(current.open, current.close);

        // Hammer pattern (small body, long lower shadow)
        if (bodyCurrent < 0.25 * candleLength && lowerShadowCurrent > 2 * bodyCurrent) {
            patterns.push({ index: i, type: 'Hammer' });
        }

        // Doji pattern (open and close are close)
        if (bodyCurrent < 0.1 * candleLength) {
            patterns.push({ index: i, type: 'Doji' });
        }

        // Engulfing pattern (current engulfs previous)
        if (current.open < previous.close && current.close > previous.open && bodyCurrent > bodyPrevious) {
            patterns.push({ index: i, type: 'Engulfing' });
        }
    }
    return patterns;
}

// Initialize the chart
const chart = LightweightCharts.createChart(document.getElementById('chart-container'), {
    width: document.getElementById('chart-container').clientWidth,
    height: 600,
    layout: {
        backgroundColor: '#fff',
        textColor: '#000',
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: '#ccc',
    },
    timeScale: {
        borderColor: '#ccc',
    },
});

const ohlcData = generateRandomData(100);
const candlestickSeries = chart.addCandlestickSeries();

// Add candlestick data to the chart
candlestickSeries.setData(ohlcData);

// Recognize and mark patterns
const patterns = recognizePatterns(ohlcData);
patterns.forEach(pattern => {
    const marker = document.createElement('div');
    marker.classList.add('pattern-marker');
    marker.style.left = `${(ohlcData[pattern.index].time - ohlcData[0].time) / (ohlcData[ohlcData.length - 1].time - ohlcData[0].time) * 100}%`;

    if (pattern.type === 'Hammer') {
        marker.style.backgroundColor = 'green';
    } else if (pattern.type === 'Doji') {
        marker.style.backgroundColor = 'red';
    } else if (pattern.type === 'Engulfing') {
        marker.style.backgroundColor = 'blue';
    }

    document.getElementById('chart-container').appendChild(marker);
});
