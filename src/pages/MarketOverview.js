import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MarketOverview = () => {
  // Sample market data
  const [marketData, setMarketData] = useState({
    totalMarketCap: 2.34, // in trillions
    totalVolume24h: 128.5, // in billions
    btcDominance: 42.8, // percentage
    ethDominance: 18.6, // percentage
    marketSentiment: 'Bullish',
    trendingCoins: [
      { id: 1, name: 'Bitcoin', ticker: 'BTC', price: 48250.75, change24h: 2.34 },
      { id: 2, name: 'Ethereum', ticker: 'ETH', price: 2785.42, change24h: 3.12 },
      { id: 3, name: 'Solana', ticker: 'SOL', price: 108.32, change24h: 4.56 },
      { id: 4, name: 'Cardano', ticker: 'ADA', price: 0.48, change24h: -1.23 },
      { id: 5, name: 'Binance Coin', ticker: 'BNB', price: 412.87, change24h: 1.75 }
    ],
    topGainers: [
      { id: 6, name: 'Aptos', ticker: 'APT', price: 8.75, change24h: 15.32 },
      { id: 7, name: 'Render Token', ticker: 'RNDR', price: 7.42, change24h: 12.45 },
      { id: 8, name: 'Injective', ticker: 'INJ', price: 32.18, change24h: 10.87 }
    ],
    topLosers: [
      { id: 9, name: 'Dogecoin', ticker: 'DOGE', price: 0.12, change24h: -5.67 },
      { id: 10, name: 'Shiba Inu', ticker: 'SHIB', price: 0.000018, change24h: -4.89 },
      { id: 11, name: 'Avalanche', ticker: 'AVAX', price: 28.45, change24h: -3.21 }
    ],
    marketNews: [
      {
        id: 1,
        title: 'Bitcoin Surpasses $48,000 as Institutional Adoption Continues',
        date: '2025-05-18',
        source: 'CryptoNews',
        url: '#'
      },
      {
        id: 2,
        title: 'Ethereum Layer 2 Solutions See Record Growth in Transaction Volume',
        date: '2025-05-17',
        source: 'BlockchainInsider',
        url: '#'
      },
      {
        id: 3,
        title: 'SEC Approves New Cryptocurrency ETF Applications',
        date: '2025-05-16',
        source: 'FinanceDaily',
        url: '#'
      },
      {
        id: 4,
        title: 'DeFi Market Cap Reaches New All-Time High',
        date: '2025-05-15',
        source: 'DeFiPulse',
        url: '#'
      }
    ]
  });

  // Simulate loading data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get market data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="market-overview-page">
      {/* Hero Section */}
      <section className="market-hero bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Market Overview</h1>
              <p className="lead">
                Stay updated with the latest cryptocurrency market trends, prices, and news.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Market Statistics Section */}
      <section className="market-stats py-5">
        <Container>
          <h2 className="mb-4">Market Statistics</h2>
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">Total Market Cap</h6>
                  <h3 className="mb-0">${marketData.totalMarketCap.toFixed(2)}T</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">24h Trading Volume</h6>
                  <h3 className="mb-0">${marketData.totalVolume24h.toFixed(1)}B</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">BTC Dominance</h6>
                  <h3 className="mb-0">{marketData.btcDominance}%</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">Market Sentiment</h6>
                  <h3 className="mb-0 text-success">{marketData.marketSentiment}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Cryptocurrency Tables Section */}
      <section className="crypto-tables py-5 bg-light">
        <Container>
          <Tabs defaultActiveKey="trending" id="crypto-market-tabs" className="mb-4">
            <Tab eventKey="trending" title="Trending Coins">
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover className="crypto-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>24h Change</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketData.trendingCoins.map((coin, index) => (
                          <tr key={coin.id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="coin-icon me-2" style={{ width: '24px', height: '24px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                                <span>{coin.name} <span className="text-muted">({coin.ticker})</span></span>
                              </div>
                            </td>
                            <td>${coin.price.toLocaleString()}</td>
                            <td className={coin.change24h >= 0 ? 'text-success' : 'text-danger'}>
                              {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                            </td>
                            <td>
                              <Button as={Link} to="/crypto-investments" variant="outline-primary" size="sm">Invest</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="gainers" title="Top Gainers">
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover className="crypto-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>24h Change</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketData.topGainers.map((coin, index) => (
                          <tr key={coin.id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="coin-icon me-2" style={{ width: '24px', height: '24px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                                <span>{coin.name} <span className="text-muted">({coin.ticker})</span></span>
                              </div>
                            </td>
                            <td>${coin.price.toLocaleString()}</td>
                            <td className="text-success">
                              +{coin.change24h}%
                            </td>
                            <td>
                              <Button as={Link} to="/crypto-investments" variant="outline-primary" size="sm">Invest</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="losers" title="Top Losers">
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover className="crypto-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>24h Change</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketData.topLosers.map((coin, index) => (
                          <tr key={coin.id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="coin-icon me-2" style={{ width: '24px', height: '24px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                                <span>{coin.name} <span className="text-muted">({coin.ticker})</span></span>
                              </div>
                            </td>
                            <td>${coin.price.toLocaleString()}</td>
                            <td className="text-danger">
                              {coin.change24h}%
                            </td>
                            <td>
                              <Button as={Link} to="/crypto-investments" variant="outline-primary" size="sm">Invest</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Container>
      </section>

      {/* Market News Section */}
      <section className="market-news py-5">
        <Container>
          <h2 className="mb-4">Latest Market News</h2>
          <Row>
            {marketData.marketNews.map(news => (
              <Col key={news.id} md={6} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="h5">{news.title}</Card.Title>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">{news.date}</small>
                      <small className="text-primary">{news.source}</small>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <a href={news.url} className="btn btn-sm btn-outline-primary w-100">Read More</a>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button variant="primary">View All News</Button>
          </div>
        </Container>
      </section>

      {/* Market Analysis Section */}
      <section className="market-analysis py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Market Analysis</h2>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="mb-3">Current Market Outlook</h4>
                  <p>
                    The cryptocurrency market continues to show strong bullish sentiment as institutional adoption increases. Bitcoin has maintained its position above the critical $45,000 support level, while Ethereum has shown impressive gains following the successful implementation of its latest network upgrade.
                  </p>
                  <p>
                    DeFi protocols are experiencing renewed interest, with total value locked (TVL) reaching new heights. Layer 2 scaling solutions for Ethereum are seeing substantial growth in transaction volumes as users seek lower gas fees and faster confirmation times.
                  </p>
                  <p>
                    Regulatory developments remain a key factor to watch, with several countries moving towards clearer frameworks for cryptocurrency operations. The recent approval of additional cryptocurrency ETFs signals growing mainstream acceptance of digital assets as a legitimate investment class.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <span className="text-muted">Last updated: May 19, 2025</span>
                    <Button variant="outline-primary" size="sm">Full Analysis</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Start Investing in Cryptocurrencies?</h2>
          <p className="lead mb-4">Join Zynith Investments and access our curated selection of cryptocurrency investment opportunities.</p>
          <Button as={Link} to="/register" variant="light" size="lg" className="me-3">Create Account</Button>
          <Button as={Link} to="/crypto-investments" variant="outline-light" size="lg">Explore Crypto Investments</Button>
        </Container>
      </section>
    </div>
  );
};

export default MarketOverview;
