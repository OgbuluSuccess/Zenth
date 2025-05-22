import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Tabs, Tab, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  // Sample portfolio data
  const [portfolioData, setPortfolioData] = useState({
    totalInvestment: 18500,
    currentValue: 21750,
    totalReturns: 3250,
    returnPercentage: 17.57,
    performanceMetrics: {
      overallReturn: 17.57,
      annualizedReturn: 12.34,
      volatility: 8.75
    },
    investments: [
      {
        id: 1,
        name: 'Blue Chip Stocks Portfolio',
        type: 'stocks',
        amount: 5000,
        purchaseDate: '2025-01-15',
        currentValue: 5750,
        returns: 750,
        returnPercentage: 15.0,
        notes: 'Long-term investment in stable companies'
      },
      {
        id: 2,
        name: 'Corporate Bond Fund',
        type: 'bonds',
        amount: 3000,
        purchaseDate: '2025-02-10',
        currentValue: 3120,
        returns: 120,
        returnPercentage: 4.0,
        notes: 'Low-risk investment for stable returns'
      },
      {
        id: 3,
        name: 'Commercial Real Estate Fund',
        type: 'real_estate',
        amount: 8000,
        purchaseDate: '2025-03-05',
        currentValue: 8480,
        returns: 480,
        returnPercentage: 6.0,
        notes: 'Diversification into real estate market'
      },
      {
        id: 4,
        name: 'Bitcoin Investment',
        type: 'cryptocurrency',
        amount: 2500,
        purchaseDate: '2025-04-20',
        currentValue: 4400,
        returns: 1900,
        returnPercentage: 76.0,
        notes: 'High-risk, high-reward investment',
        cryptoDetails: {
          walletAddress: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
          transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          coinAmount: 0.05
        }
      }
    ],
    historicalPerformance: [
      { month: 'Jan', value: 18750 },
      { month: 'Feb', value: 19200 },
      { month: 'Mar', value: 19800 },
      { month: 'Apr', value: 20500 },
      { month: 'May', value: 21750 }
    ]
  });

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero bg-primary text-white py-4">
        <Container>
          <h1 className="mb-0">Your Investment Portfolio</h1>
        </Container>
      </section>

      {/* Portfolio Summary Section */}
      <section className="portfolio-summary py-4">
        <Container>
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h6 className="text-muted mb-2">Total Investment</h6>
                  <h3 className="mb-0">${portfolioData.totalInvestment.toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h6 className="text-muted mb-2">Current Value</h6>
                  <h3 className="mb-0">${portfolioData.currentValue.toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h6 className="text-muted mb-2">Total Returns</h6>
                  <h3 className="mb-0 text-success">${portfolioData.totalReturns.toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h6 className="text-muted mb-2">Return Percentage</h6>
                  <h3 className="mb-0 text-success">{portfolioData.returnPercentage}%</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Portfolio Performance Chart */}
      <section className="portfolio-performance py-4 bg-light">
        <Container>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Portfolio Performance</h4>
            </Card.Header>
            <Card.Body>
              <div className="performance-chart bg-white p-4 rounded" style={{ height: '300px' }}>
                {/* In a real app, you would use Chart.js or similar to render a line chart */}
                <div className="text-center py-5">
                  <p>Line Chart Placeholder</p>
                  <p className="text-muted">A chart would be displayed here in the actual implementation</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Portfolio Details Section */}
      <section className="portfolio-details py-4">
        <Container>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Portfolio Details</h4>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="investments" id="portfolio-tabs" className="mb-3">
                <Tab eventKey="investments" title="Your Investments">
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Investment</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Current Value</th>
                          <th>Returns</th>
                          <th>Return %</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.investments.map(investment => (
                          <tr key={investment.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="investment-icon me-2" style={{ width: '24px', height: '24px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                                <span>{investment.name}</span>
                              </div>
                            </td>
                            <td>
                              <Badge bg="info">
                                {investment.type.replace('_', ' ').charAt(0).toUpperCase() + investment.type.replace('_', ' ').slice(1)}
                              </Badge>
                            </td>
                            <td>${investment.amount.toLocaleString()}</td>
                            <td>${investment.currentValue.toLocaleString()}</td>
                            <td className={investment.returns >= 0 ? 'text-success' : 'text-danger'}>
                              ${investment.returns.toLocaleString()}
                            </td>
                            <td className={investment.returnPercentage >= 0 ? 'text-success' : 'text-danger'}>
                              {investment.returnPercentage}%
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2">Details</Button>
                              <Button variant="outline-success" size="sm">Add More</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                <Tab eventKey="metrics" title="Performance Metrics">
                  <Row className="mb-4">
                    <Col md={4}>
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <h6 className="text-muted mb-2">Overall Return</h6>
                          <h3 className="text-success mb-0">{portfolioData.performanceMetrics.overallReturn}%</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <h6 className="text-muted mb-2">Annualized Return</h6>
                          <h3 className="text-success mb-0">{portfolioData.performanceMetrics.annualizedReturn}%</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <h6 className="text-muted mb-2">Portfolio Volatility</h6>
                          <h3 className="mb-0">{portfolioData.performanceMetrics.volatility}%</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <div className="metrics-chart bg-light p-4 rounded" style={{ height: '300px' }}>
                    {/* In a real app, you would use Chart.js or similar to render a performance chart */}
                    <div className="text-center py-5">
                      <p>Performance Metrics Chart Placeholder</p>
                      <p className="text-muted">A chart would be displayed here in the actual implementation</p>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="crypto" title="Crypto Investments">
                  {portfolioData.investments.filter(inv => inv.type === 'cryptocurrency').length > 0 ? (
                    <div>
                      <div className="table-responsive mb-4">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Investment</th>
                              <th>Amount</th>
                              <th>Coin Amount</th>
                              <th>Current Value</th>
                              <th>Returns</th>
                              <th>Wallet Address</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {portfolioData.investments.filter(inv => inv.type === 'cryptocurrency').map(investment => (
                              <tr key={investment.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="crypto-icon me-2" style={{ width: '24px', height: '24px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                                    <span>{investment.name}</span>
                                  </div>
                                </td>
                                <td>${investment.amount.toLocaleString()}</td>
                                <td>{investment.cryptoDetails.coinAmount} BTC</td>
                                <td>${investment.currentValue.toLocaleString()}</td>
                                <td className="text-success">${investment.returns.toLocaleString()} ({investment.returnPercentage}%)</td>
                                <td>
                                  <code className="bg-light p-1 rounded small">
                                    {investment.cryptoDetails.walletAddress.substring(0, 8)}...{investment.cryptoDetails.walletAddress.substring(investment.cryptoDetails.walletAddress.length - 8)}
                                  </code>
                                </td>
                                <td>
                                  <Button variant="outline-primary" size="sm" className="me-2">View Transaction</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <Alert variant="info">
                        <i className="fas fa-info-circle me-2"></i>
                        Cryptocurrency investments are subject to high volatility. Monitor your investments regularly and consider setting up price alerts.
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <h5>No Cryptocurrency Investments</h5>
                      <p className="text-muted">You don't have any cryptocurrency investments in your portfolio yet.</p>
                      <Button as={Link} to="/crypto-investments" variant="primary">Explore Crypto Investments</Button>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Actions Section */}
      <section className="portfolio-actions py-4 bg-light">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <div className="action-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-plus fa-lg"></i>
                  </div>
                  <h5>Add Investment</h5>
                  <p className="text-muted">Explore new investment opportunities to diversify your portfolio.</p>
                  <Button as={Link} to="/investments" variant="primary">Invest Now</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <div className="action-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-wallet fa-lg"></i>
                  </div>
                  <h5>Connect Wallet</h5>
                  <p className="text-muted">Link your cryptocurrency wallet to track your crypto investments.</p>
                  <Button variant="success">Connect Wallet</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <div className="action-icon bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-file-export fa-lg"></i>
                  </div>
                  <h5>Export Report</h5>
                  <p className="text-muted">Download a detailed report of your investment portfolio.</p>
                  <Button variant="info">Generate Report</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Portfolio;
