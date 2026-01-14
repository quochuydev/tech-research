# yfinance - Technical Overview

yfinance is an open-source Python library that provides a simple, Pythonic interface to download financial market data from Yahoo Finance. Created by Ran Aroussi, it's one of the most popular tools for fetching historical stock prices, financial statements, and other market data for research and educational purposes.

## High-Level Architecture

```mermaid
graph TB
    subgraph "User Application"
        App[Python Application]
        Pandas[Pandas DataFrames]
    end

    subgraph "yfinance Library"
        Ticker[Ticker Module]
        Tickers[Tickers Module]
        Download[Download Module]
        Cache[Cache System]
        Session[Session Manager]
    end

    subgraph "Yahoo Finance"
        API[Yahoo Finance API Endpoints]
        HTML[Yahoo Finance Web Pages]
        WS[WebSocket Feeds]
    end

    App -->|Create Ticker| Ticker
    App -->|Batch Download| Download
    App -->|Multiple Tickers| Tickers

    Ticker -->|API Calls| API
    Ticker -->|HTML Scraping| HTML
    Download -->|Threaded Requests| API
    Tickers -->|Parallel Fetch| API

    Cache -->|Store/Retrieve| Ticker
    Session -->|Custom Headers/Proxy| API

    API -->|JSON Data| Ticker
    HTML -->|Parsed Data| Ticker
    WS -->|Real-time Data| Ticker

    Ticker -->|Return| Pandas
    Download -->|Return| Pandas
    Tickers -->|Return| Pandas

    Pandas -->|Analysis Ready| App

    style API fill:#4CAF50,color:#fff
    style HTML fill:#FF9800,color:#fff
    style WS fill:#2196F3,color:#fff
    style Cache fill:#9C27B0,color:#fff
```

## Data Retrieval Flow

```mermaid
sequenceDiagram
    participant User as Python App
    participant YF as yfinance
    participant Cache as Local Cache
    participant Yahoo as Yahoo Finance

    User->>YF: yf.Ticker("AAPL")
    YF->>Cache: Check timezone cache
    Cache-->>YF: Return cached TZ or miss

    User->>YF: ticker.history(period="1y")
    YF->>YF: Build request URL
    YF->>Yahoo: HTTP GET /v8/finance/chart/AAPL
    Yahoo-->>YF: JSON response (OHLCV data)
    YF->>YF: Parse JSON to DataFrame
    YF->>YF: Localize timestamps
    YF-->>User: Return pandas DataFrame

    User->>YF: ticker.info
    YF->>Yahoo: HTTP GET /v10/finance/quoteSummary
    Yahoo-->>YF: JSON response
    alt Some data missing
        YF->>Yahoo: Scrape HTML page
        Yahoo-->>YF: HTML content
        YF->>YF: Parse HTML tables
    end
    YF-->>User: Return dict

    User->>YF: ticker.financials
    YF->>Yahoo: GET financial statements endpoint
    Yahoo-->>YF: JSON/HTML response
    YF->>YF: Transform to DataFrame
    YF-->>User: Return pandas DataFrame
```

## Core Module Architecture

```mermaid
classDiagram
    class Ticker {
        +str ticker
        +Session session
        +history(period, interval, start, end)
        +info: dict
        +financials: DataFrame
        +balance_sheet: DataFrame
        +cashflow: DataFrame
        +dividends: Series
        +splits: Series
        +options: tuple
        +option_chain(date)
        +news: list
        +recommendations: DataFrame
        +sustainability: DataFrame
        +calendar: DataFrame
    }

    class Tickers {
        +list tickers
        +dict _tickers
        +history(period, interval)
        +download(period, interval)
    }

    class Download {
        +download(tickers, start, end, period, interval, threads)
    }

    class Market {
        +str market
        +status: dict
        +summary: dict
    }

    class Cache {
        +TzCache tz_cache
        +CookieCache cookie_cache
        +get_tz(ticker)
        +set_tz(ticker, tz)
    }

    class Search {
        +str query
        +quotes: list
        +news: list
    }

    class Screener {
        +EquityQuery query
        +response: DataFrame
    }

    Ticker --> Cache : uses
    Tickers --> Ticker : contains
    Download --> Ticker : creates
    Screener --> Search : uses

    style Ticker fill:#2196F3,color:#fff
    style Download fill:#4CAF50,color:#fff
    style Cache fill:#9C27B0,color:#fff
```

## Key Concepts

### Data Sources
yfinance retrieves data through two primary methods:
1. **API Calls** - Direct HTTP requests to Yahoo Finance's JSON endpoints (preferred method for price data)
2. **HTML Scraping** - Parsing web pages for data not available via API (used for some financial statements and company info)

### Supported Data Types
| Data Type | Method | Output |
|-----------|--------|--------|
| Historical Prices | `history()` / `download()` | DataFrame with OHLCV |
| Company Info | `info` | Dictionary |
| Financial Statements | `financials`, `balance_sheet`, `cashflow` | DataFrame |
| Dividends & Splits | `dividends`, `splits` | Series |
| Options Data | `options`, `option_chain()` | Tuple / DataFrame |
| Analyst Data | `recommendations`, `analyst_price_target` | DataFrame |
| News | `news` | List of dicts |
| ESG Scores | `sustainability` | DataFrame |

### Time Intervals
| Period | Interval Options |
|--------|------------------|
| Intraday (7 days max) | 1m, 2m, 5m, 15m, 30m, 60m, 90m |
| Short-term (60 days max) | 1h |
| Long-term | 1d, 5d, 1wk, 1mo, 3mo |

## Download Module - Batch Processing

```mermaid
flowchart TD
    Start[yf.download called] --> Parse[Parse ticker list]
    Parse --> Check{Multiple tickers?}

    Check -->|Yes| Thread[Create thread pool]
    Thread --> Batch[Split tickers into batches]
    Batch --> Parallel[Parallel API requests]
    Parallel --> Collect[Collect responses]

    Check -->|No| Single[Single API request]
    Single --> Collect

    Collect --> Validate{Valid responses?}
    Validate -->|Yes| Transform[Transform to DataFrame]
    Validate -->|No| Retry{Retry count < max?}

    Retry -->|Yes| BackOff[Exponential backoff]
    BackOff --> Parallel
    Retry -->|No| Error[Return partial data with warnings]

    Transform --> Multi{Multi-ticker?}
    Multi -->|Yes| MultiIndex[Create MultiIndex columns]
    Multi -->|No| Simple[Simple DataFrame]

    MultiIndex --> Return[Return DataFrame]
    Simple --> Return

    style Thread fill:#4CAF50,color:#fff
    style Parallel fill:#2196F3,color:#fff
    style BackOff fill:#FF9800,color:#fff
    style Error fill:#f44336,color:#fff
```

## Caching Architecture

```mermaid
graph TB
    subgraph "yfinance Cache System"
        subgraph "Timezone Cache"
            TZ[TzCache]
            TZDB[(SQLite DB)]
            TZ -->|Read/Write| TZDB
        end

        subgraph "Cookie Cache"
            Cookie[CookieCache]
            CookieDB[(SQLite DB)]
            Cookie -->|Read/Write| CookieDB
        end

        subgraph "Custom Session Cache"
            ReqCache[requests_cache]
            CacheDB[(Cache Backend)]
            ReqCache -->|Store responses| CacheDB
        end
    end

    subgraph "Cache Locations"
        Win[Windows: C:/Users/USER/AppData/Local/py-yfinance]
        Mac[macOS: ~/Library/Caches/py-yfinance]
        Linux[Linux: ~/.cache/py-yfinance]
    end

    TZDB --> Win
    TZDB --> Mac
    TZDB --> Linux

    style TZ fill:#9C27B0,color:#fff
    style Cookie fill:#673AB7,color:#fff
    style ReqCache fill:#3F51B5,color:#fff
```

## Ecosystem & Integrations

```mermaid
graph LR
    subgraph "Data Source"
        YF[yfinance]
    end

    subgraph "Data Analysis"
        Pandas[pandas]
        NumPy[numpy]
        Scipy[scipy]
    end

    subgraph "Technical Analysis"
        TALib[TA-Lib]
        Tulipy[tulipy]
        Finta[finta]
    end

    subgraph "Backtesting Frameworks"
        Backtrader[backtrader]
        BT[Backtesting.py]
        Zipline[zipline]
        VectorBT[vectorbt]
        Lumibot[lumibot]
    end

    subgraph "Visualization"
        Matplotlib[matplotlib]
        Plotly[plotly]
        mplfinance[mplfinance]
    end

    subgraph "Machine Learning"
        Sklearn[scikit-learn]
        TF[TensorFlow]
        PyTorch[PyTorch]
    end

    YF -->|DataFrame| Pandas
    Pandas --> NumPy
    Pandas --> TALib
    Pandas --> Backtrader
    Pandas --> BT
    Pandas --> VectorBT
    Pandas --> Matplotlib
    Pandas --> Sklearn

    style YF fill:#4CAF50,color:#fff
    style Pandas fill:#2196F3,color:#fff
    style Backtrader fill:#FF9800,color:#fff
```

## Alternative Python Libraries

```mermaid
graph TB
    subgraph "Yahoo Finance Wrappers"
        YF[yfinance<br/>Most popular, easy to use]
        YQ[yahooquery<br/>Async support, faster]
        YFin[yahoo_fin<br/>Good for options/news]
    end

    subgraph "Official/Premium APIs"
        Polygon[Polygon.io<br/>Real-time, paid]
        Alpha[Alpha Vantage<br/>Free tier available]
        IEX[IEX Cloud<br/>Comprehensive data]
        Alpaca[Alpaca<br/>Free with brokerage]
    end

    subgraph "Brokerage APIs"
        IBKR[Interactive Brokers<br/>TWS API]
        TDA[TD Ameritrade<br/>tda-api]
    end

    User[Developer] --> Decision{Use Case?}
    Decision -->|Research/Learning| YF
    Decision -->|High Volume| YQ
    Decision -->|Production| Polygon
    Decision -->|Trading Bot| Alpaca
    Decision -->|Options Heavy| YFin

    style YF fill:#4CAF50,color:#fff
    style YQ fill:#8BC34A,color:#fff
    style Polygon fill:#2196F3,color:#fff
```

## Key Facts (2025)

- **GitHub Stars**: 20.7k+
- **PyPI Downloads**: Millions per month (one of the most downloaded finance libraries)
- **Current Version**: 1.0 (released December 2025)
- **Dependencies**: pandas, numpy, requests, lxml, multitasking, frozendict, peewee, beautifulsoup4
- **Python Support**: 2.7, 3.6+
- **License**: Apache 2.0
- **Maintainer**: Ran Aroussi (community-maintained)
- **Used By**: ~85,600+ dependent projects on GitHub
- **Release Frequency**: Multiple releases per month

## Common Use Cases

### 1. Algorithmic Trading Research
```python
import yfinance as yf

# Download historical data for backtesting
data = yf.download("AAPL", period="2y", interval="1d")

# Calculate simple moving averages
data['SMA_20'] = data['Close'].rolling(window=20).mean()
data['SMA_50'] = data['Close'].rolling(window=50).mean()
```

### 2. Portfolio Analysis
```python
# Download multiple assets
tickers = ["AAPL", "GOOGL", "MSFT", "AMZN"]
portfolio = yf.download(tickers, period="1y", group_by='ticker')
```

### 3. Fundamental Analysis
```python
ticker = yf.Ticker("AAPL")
info = ticker.info  # Company information
financials = ticker.financials  # Income statement
balance = ticker.balance_sheet  # Balance sheet
cashflow = ticker.cashflow  # Cash flow statement
```

### 4. Options Analysis
```python
ticker = yf.Ticker("AAPL")
expirations = ticker.options  # Get expiration dates
chain = ticker.option_chain(expirations[0])  # Get options chain
calls = chain.calls
puts = chain.puts
```

### 5. Real-time Streaming (v1.0+)
```python
import yfinance as yf

# WebSocket streaming for real-time data
ws = yf.WebSocket()
ws.subscribe(["AAPL", "GOOGL"])
```

## Security & Considerations

### Rate Limiting
- Yahoo Finance may rate-limit or block IPs making excessive requests
- No official rate limit documentation; community estimates ~100-500 requests/day safely
- HTTP 429 errors indicate rate limiting
- Implement delays (1-5 seconds) between requests for bulk operations

### Reliability Concerns
| Risk | Description | Mitigation |
|------|-------------|------------|
| API Changes | Yahoo may change endpoints without notice | Keep yfinance updated; monitor GitHub issues |
| Rate Limiting | Excessive requests cause temporary blocks | Implement caching and request throttling |
| Data Accuracy | Unofficial data source, no SLA | Cross-validate critical data with official sources |
| Availability | Dependent on Yahoo Finance uptime | Have fallback data sources for production |

### Best Practices
1. **Use caching** - Implement `requests_cache` for repeated queries
2. **Add delays** - Sleep between requests to avoid rate limits
3. **Use proxies** - Rotate proxies for high-volume applications
4. **Handle errors** - Implement retry logic with exponential backoff
5. **Validate data** - Cross-check with official sources for critical decisions

### Legal Considerations
- yfinance is intended for **personal, research, and educational use only**
- Not affiliated with or endorsed by Yahoo, Inc.
- Review Yahoo's Terms of Service for commercial use restrictions
- Consider official API providers for production applications

## Sources

- [yfinance GitHub Repository](https://github.com/ranaroussi/yfinance)
- [yfinance PyPI](https://pypi.org/project/yfinance/)
- [yfinance Documentation](https://ranaroussi.github.io/yfinance/)
- [AlgoTrading101 yfinance Guide](https://algotrading101.com/learn/yfinance-guide/)
- [Yahoo Finance API Guide](https://algotrading101.com/learn/yahoo-finance-api-guide/)
- [Interactive Brokers yfinance Guide](https://www.interactivebrokers.com/campus/ibkr-quant-news/yfinance-library-a-complete-guide/)
