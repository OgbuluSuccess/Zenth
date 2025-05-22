import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Table } from 'react-bootstrap';

const CryptoInvestments = () => {
  // Sample cryptocurrency investment data
  const cryptoInvestments = [
    {
      id: 1,
      name: 'Bitcoin (BTC)',
      description: 'The original cryptocurrency and the largest by market capitalization.',
      riskLevel: 'high',
      minimumInvestment: 500,
      expectedReturns: '15-25% annually',
      currentPrice: 48250.75,
      priceChange24h: 2.34,
      marketCap: 923000000000,
      volume24h: 28500000000,
      image: 'https://via.placeholder.com/300x200?text=Bitcoin',
      ticker: 'BTC',
      blockchain: 'Bitcoin',
      walletCompatibility: ['MetaMask', 'Trust Wallet', 'Ledger', 'Trezor'],
      stakingAvailable: false,
      apy: null
    },
    {
      id: 2,
      name: 'Ethereum (ETH)',
      description: 'A decentralized software platform that enables smart contracts and decentralized applications.',
      riskLevel: 'high',
      minimumInvestment: 250,
      expectedReturns: '20-30% annually',
      currentPrice: 2785.42,
      priceChange24h: 3.12,
      marketCap: 335000000000,
      volume24h: 18700000000,
      image: 'https://via.placeholder.com/300x200?text=Ethereum',
      ticker: 'ETH',
      blockchain: 'Ethereum',
      walletCompatibility: ['MetaMask', 'Trust Wallet', 'Ledger', 'Trezor'],
      stakingAvailable: true,
      apy: 4.5
    },
    {
      id: 3,
      name: 'Binance Coin (BNB)',
      description: 'The native cryptocurrency of the Binance exchange and Binance Smart Chain.',
      riskLevel: 'high',
      minimumInvestment: 100,
      expectedReturns: '15-25% annually',
      currentPrice: 412.87,
      priceChange24h: 1.75,
      marketCap: 67500000000,
      volume24h: 2350000000,
      image: 'https://via.placeholder.com/300x200?text=Binance+Coin',
      ticker: 'BNB',
      blockchain: 'Binance Smart Chain',
      walletCompatibility: ['MetaMask', 'Trust Wallet', 'Binance Wallet'],
      stakingAvailable: true,
      apy: 5.2
    },
    {
      id: 4,
      name: 'Solana (SOL)',
      description: 'A high-performance blockchain supporting smart contracts and decentralized applications.',
      riskLevel: 'high',
      minimumInvestment: 50,
      expectedReturns: '25-35% annually',
      currentPrice: 108.32,
      priceChange24h: 4.56,
      marketCap: 43500000000,
      volume24h: 3120000000,
      image: 'https://via.placeholder.com/300x200?text=Solana',
      ticker: 'SOL',
      blockchain: 'Solana',
      walletCompatibility: ['Phantom', 'Solflare', 'Ledger'],
      stakingAvailable: true,
      apy: 6.8
    },
    {
      id: 5,
      name: 'Cardano (ADA)',
      description: 'A proof-of-stake blockchain platform that aims to enable "changemakers, innovators, and visionaries".',
      riskLevel: 'high',
      minimumInvestment: 25,
      expectedReturns: '15-25% annually',
      currentPrice: 0.48,
      priceChange24h: -1.23,
      marketCap: 16800000000,
      volume24h: 875000000,
      image: 'https://via.placeholder.com/300x200?text=Cardano',
      ticker: 'ADA',
      blockchain: 'Cardano',
      walletCompatibility: ['Daedalus', 'Yoroi', 'Ledger'],
      stakingAvailable: true,
      apy: 4.2
    },
    {
      id: 6,
      name: 'DeFi Index Fund',
      description: 'A diversified portfolio of top decentralized finance (DeFi) tokens.',
      riskLevel: 'high',
      minimumInvestment: 1000,
      expectedReturns: '20-30% annually',
      currentPrice: null, // Not applicable for index fund
      priceChange24h: 2.87,
      marketCap: null, // Not applicable for index fund
      volume24h: null, // Not applicable for index fund
      image: 'https://via.placeholder.com/300x200?text=DeFi+Index',
      ticker: 'DEFI-IDX',
      blockchain: 'Multiple',
      walletCompatibility: ['MetaMask', 'Trust Wallet'],
      stakingAvailable: false,
      apy: null
    }
  ];

  // State for filters
  const [filters, setFilters] = useState({
    minInvestment: '',
    stakingOnly: false,
    walletType: ''
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Filter crypto investments based on selected filters
  const filteredCryptoInvestments = cryptoInvestments.filter(investment => {
    // Filter by minimum investment
    if (filters.minInvestment) {
      const minAmount = parseInt(filters.minInvestment);
      if (investment.minimumInvestment > minAmount) {
        return false;
      }
    }
    
    // Filter by staking availability
    if (filters.stakingOnly && !investment.stakingAvailable) {
      return false;
    }
    
    // Filter by wallet compatibility
    if (filters.walletType && !investment.walletCompatibility.includes(filters.walletType)) {
      return false;
    }
    
    return true;
  });

  // Get all unique wallet types for filter options
  const allWalletTypes = [...new Set(cryptoInvestments.flatMap(investment => investment.walletCompatibility))];

  return (
    <div className="crypto-investments-page">
      {/* Hero Section */}
      <section className="crypto-hero bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Cryptocurrency Investments</h1>
              <p className="lead">
                Explore our selection of cryptocurrency investment opportunities with real-time market data.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Market Overview Section */}
      <section className="market-overview py-4 bg-light">
        <Container>
          <h3 className="mb-4">Market Overview</h3>
          <div className="table-responsive">
            <Table striped hover className="crypto-market-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Market Cap</th>
                  <th>24h Volume</th>
                </tr>
              </thead>
              <tbody>
                {cryptoInvestments.filter(crypto => crypto.currentPrice).map(crypto => (
                  <tr key={crypto.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="crypto-icon me-2" style={{ width: '24px', height: '24px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                        <span>{crypto.name}</span>
                      </div>
                    </td>
                    <td>${crypto.currentPrice.toLocaleString()}</td>
                    <td className={crypto.priceChange24h >= 0 ? 'text-success' : 'text-danger'}>
                      {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h}%
                    </td>
                    <td>${(crypto.marketCap / 1000000000).toFixed(2)}B</td>
                    <td>${(crypto.volume24h / 1000000000).toFixed(2)}B</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </section>

      {/* Crypto Investments Listing Section */}
      <section className="crypto-investments-listing py-5">
        <Container>
          <Row>
            {/* Filters Sidebar */}
            <Col lg={3} className="mb-4 mb-lg-0">
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">Filters</h4>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-4">
                      <Form.Label>Maximum Initial Investment</Form.Label>
                      <Form.Select 
                        name="minInvestment" 
                        value={filters.minInvestment} 
                        onChange={handleFilterChange}
                      >
                        <option value="">Any Amount</option>
                        <option value="50">Up to $50</option>
                        <option value="100">Up to $100</option>
                        <option value="250">Up to $250</option>
                        <option value="500">Up to $500</option>
                        <option value="1000">Up to $1,000</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Check 
                        type="checkbox" 
                        id="stakingOnly"
                        name="stakingOnly"
                        label="Staking Available Only" 
                        checked={filters.stakingOnly}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Wallet Compatibility</Form.Label>
                      <Form.Select 
                        name="walletType" 
                        value={filters.walletType} 
                        onChange={handleFilterChange}
                      >
                        <option value="">Any Wallet</option>
                        {allWalletTypes.map(wallet => (
                          <option key={wallet} value={wallet}>{wallet}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    
                    <Button 
                      variant="outline-secondary" 
                      className="w-100"
                      onClick={() => setFilters({
                        minInvestment: '',
                        stakingOnly: false,
                        walletType: ''
                      })}
                    >
                      Clear Filters
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Crypto Investments Grid */}
            <Col lg={9}>
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Showing {filteredCryptoInvestments.length} crypto investments</h4>
              </div>
              
              <Row>
                {filteredCryptoInvestments.length > 0 ? (
                  filteredCryptoInvestments.map(investment => (
                    <Col key={investment.id} md={6} lg={4} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={investment.image} />
                        <Card.Body>
                          <Card.Title>{investment.name}</Card.Title>
                          <div className="mb-2">
                            <Badge bg="danger" className="me-2">High Risk</Badge>
                            <Badge bg="info">{investment.ticker}</Badge>
                          </div>
                          <Card.Text>{investment.description}</Card.Text>
                          
                          <div className="mb-3">
                            <small className="d-block text-muted mb-1">Minimum Investment</small>
                            <strong className="d-block">${investment.minimumInvestment.toLocaleString()}</strong>
                          </div>
                          
                          <div className="mb-3">
                            <small className="d-block text-muted mb-1">Expected Returns</small>
                            <strong className="d-block text-primary">{investment.expectedReturns}</strong>
                          </div>
                          
                          {investment.stakingAvailable && (
                            <div className="mb-3">
                              <Badge bg="success" className="me-2">Staking Available</Badge>
                              <span className="text-success">{investment.apy}% APY</span>
                            </div>
                          )}
                          
                          <div className="mb-3">
                            <small className="d-block text-muted mb-1">Wallet Compatibility</small>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {investment.walletCompatibility.map(wallet => (
                                <Badge key={wallet} bg="light" text="dark" className="me-1 mb-1">{wallet}</Badge>
                              ))}
                            </div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white border-0">
                          <Button variant="primary" className="w-100">Invest Now</Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <div className="text-center py-5">
                      <h4>No crypto investments match your filters</h4>
                      <p className="text-muted">Try adjusting your filter criteria</p>
                      <Button 
                        variant="primary"
                        onClick={() => setFilters({
                          minInvestment: '',
                          stakingOnly: false,
                          walletType: ''
                        })}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Crypto Education Section */}
      <section className="crypto-education py-5 bg-light">
        <Container>
          <h3 className="text-center mb-5">Cryptocurrency Investment Guide</h3>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="accordion" id="cryptoEducationAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                      What is cryptocurrency?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#cryptoEducationAccordion">
                    <div className="accordion-body">
                      Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on decentralized networks based on blockchain technology. Unlike traditional currencies issued by governments (fiat currencies), cryptocurrencies operate without a central authority or bank.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                      How to start investing in cryptocurrency?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#cryptoEducationAccordion">
                    <div className="accordion-body">
                      <ol>
                        <li>Create an account on Zynith Investments</li>
                        <li>Complete your KYC verification</li>
                        <li>Set up two-factor authentication for security</li>
                        <li>Link a compatible crypto wallet or use our custodial solution</li>
                        <li>Fund your account</li>
                        <li>Choose your cryptocurrency investments</li>
                        <li>Monitor and manage your portfolio</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                      What are the risks of cryptocurrency investments?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#cryptoEducationAccordion">
                    <div className="accordion-body">
                      <p>Cryptocurrency investments come with several risks:</p>
                      <ul>
                        <li><strong>Volatility:</strong> Prices can fluctuate dramatically in short periods</li>
                        <li><strong>Regulatory Risk:</strong> Changes in government regulations can impact value</li>
                        <li><strong>Security Risk:</strong> Potential for hacks, scams, or loss of access to wallets</li>
                        <li><strong>Market Risk:</strong> The cryptocurrency market is still relatively new and evolving</li>
                        <li><strong>Liquidity Risk:</strong> Some cryptocurrencies may be difficult to sell quickly</li>
                      </ul>
                      <p>We recommend only investing what you can afford to lose and diversifying your investment portfolio.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default CryptoInvestments;
