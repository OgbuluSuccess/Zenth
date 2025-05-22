import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';

const Investments = () => {
  // Sample investment data
  const allInvestments = [
    {
      id: 1,
      name: 'Blue Chip Stocks Portfolio',
      type: 'stocks',
      description: 'A collection of stable, well-established companies with excellent reputations.',
      riskLevel: 'medium',
      minimumInvestment: 5000,
      expectedReturns: '8-12% annually',
      duration: 'Long-term',
      sectors: ['Technology', 'Finance', 'Healthcare'],
      regions: ['North America', 'Europe'],
      image: 'https://via.placeholder.com/300x200?text=Blue+Chip+Stocks'
    },
    {
      id: 2,
      name: 'Growth Stocks Fund',
      type: 'stocks',
      description: 'Focused on companies expected to grow at an above-average rate compared to other companies.',
      riskLevel: 'high',
      minimumInvestment: 10000,
      expectedReturns: '12-18% annually',
      duration: 'Long-term',
      sectors: ['Technology', 'Renewable Energy', 'E-commerce'],
      regions: ['North America', 'Asia'],
      image: 'https://via.placeholder.com/300x200?text=Growth+Stocks'
    },
    {
      id: 3,
      name: 'Corporate Bond Fund',
      type: 'bonds',
      description: 'Fixed-income securities issued by corporations with strong credit ratings.',
      riskLevel: 'low',
      minimumInvestment: 2500,
      expectedReturns: '4-6% annually',
      duration: 'Medium-term',
      sectors: ['Finance', 'Utilities', 'Consumer Goods'],
      regions: ['Global'],
      image: 'https://via.placeholder.com/300x200?text=Corporate+Bonds'
    },
    {
      id: 4,
      name: 'Government Bonds',
      type: 'bonds',
      description: 'Debt securities issued by government entities, known for their safety and reliability.',
      riskLevel: 'low',
      minimumInvestment: 1000,
      expectedReturns: '2-4% annually',
      duration: 'Long-term',
      sectors: ['Government'],
      regions: ['North America', 'Europe'],
      image: 'https://via.placeholder.com/300x200?text=Government+Bonds'
    },
    {
      id: 5,
      name: 'Commercial Real Estate Fund',
      type: 'real_estate',
      description: 'Investments in office buildings, retail spaces, and industrial properties.',
      riskLevel: 'medium',
      minimumInvestment: 25000,
      expectedReturns: '7-10% annually',
      duration: 'Long-term',
      sectors: ['Commercial Real Estate'],
      regions: ['North America', 'Europe'],
      image: 'https://via.placeholder.com/300x200?text=Commercial+Real+Estate'
    },
    {
      id: 6,
      name: 'Residential REIT',
      type: 'real_estate',
      description: 'Real Estate Investment Trust focused on residential properties and apartment complexes.',
      riskLevel: 'medium',
      minimumInvestment: 5000,
      expectedReturns: '6-9% annually',
      duration: 'Medium-term',
      sectors: ['Residential Real Estate'],
      regions: ['North America'],
      image: 'https://via.placeholder.com/300x200?text=Residential+REIT'
    },
    {
      id: 7,
      name: 'Bitcoin Investment',
      type: 'cryptocurrency',
      description: 'Direct investment in Bitcoin, the world\'s leading cryptocurrency.',
      riskLevel: 'high',
      minimumInvestment: 1000,
      expectedReturns: '15-25% annually',
      duration: 'Medium-term',
      sectors: ['Cryptocurrency'],
      regions: ['Global'],
      image: 'https://via.placeholder.com/300x200?text=Bitcoin'
    },
    {
      id: 8,
      name: 'Ethereum Fund',
      type: 'cryptocurrency',
      description: 'Investment in Ethereum, the second-largest cryptocurrency by market capitalization.',
      riskLevel: 'high',
      minimumInvestment: 1000,
      expectedReturns: '20-30% annually',
      duration: 'Medium-term',
      sectors: ['Cryptocurrency', 'DeFi'],
      regions: ['Global'],
      image: 'https://via.placeholder.com/300x200?text=Ethereum'
    }
  ];

  // State for filters
  const [filters, setFilters] = useState({
    type: '',
    riskLevel: '',
    minInvestment: '',
    sectors: []
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Handle sector filter changes
  const handleSectorChange = (sector) => {
    setFilters(prevFilters => {
      const updatedSectors = [...prevFilters.sectors];
      if (updatedSectors.includes(sector)) {
        return {
          ...prevFilters,
          sectors: updatedSectors.filter(s => s !== sector)
        };
      } else {
        return {
          ...prevFilters,
          sectors: [...updatedSectors, sector]
        };
      }
    });
  };

  // Filter investments based on selected filters
  const filteredInvestments = allInvestments.filter(investment => {
    // Filter by type
    if (filters.type && investment.type !== filters.type) {
      return false;
    }
    
    // Filter by risk level
    if (filters.riskLevel && investment.riskLevel !== filters.riskLevel) {
      return false;
    }
    
    // Filter by minimum investment
    if (filters.minInvestment) {
      const minAmount = parseInt(filters.minInvestment);
      if (investment.minimumInvestment > minAmount) {
        return false;
      }
    }
    
    // Filter by sectors
    if (filters.sectors.length > 0) {
      const hasMatchingSector = investment.sectors.some(sector => 
        filters.sectors.includes(sector)
      );
      if (!hasMatchingSector) {
        return false;
      }
    }
    
    return true;
  });

  // Get all unique sectors for filter options
  const allSectors = [...new Set(allInvestments.flatMap(investment => investment.sectors))];

  return (
    <div className="investments-page">
      {/* Hero Section */}
      <section className="investments-hero bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Explore Investments</h1>
              <p className="lead">
                Discover a wide range of investment opportunities tailored to your financial goals.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Investments Listing Section */}
      <section className="investments-listing py-5">
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
                      <Form.Label>Investment Type</Form.Label>
                      <Form.Select 
                        name="type" 
                        value={filters.type} 
                        onChange={handleFilterChange}
                      >
                        <option value="">All Types</option>
                        <option value="stocks">Stocks</option>
                        <option value="bonds">Bonds</option>
                        <option value="real_estate">Real Estate</option>
                        <option value="cryptocurrency">Cryptocurrency</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Risk Level</Form.Label>
                      <Form.Select 
                        name="riskLevel" 
                        value={filters.riskLevel} 
                        onChange={handleFilterChange}
                      >
                        <option value="">All Risk Levels</option>
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Maximum Initial Investment</Form.Label>
                      <Form.Select 
                        name="minInvestment" 
                        value={filters.minInvestment} 
                        onChange={handleFilterChange}
                      >
                        <option value="">Any Amount</option>
                        <option value="1000">Up to $1,000</option>
                        <option value="5000">Up to $5,000</option>
                        <option value="10000">Up to $10,000</option>
                        <option value="25000">Up to $25,000</option>
                        <option value="50000">Up to $50,000</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Sectors</Form.Label>
                      {allSectors.map(sector => (
                        <Form.Check 
                          key={sector}
                          type="checkbox" 
                          id={`sector-${sector}`}
                          label={sector}
                          checked={filters.sectors.includes(sector)}
                          onChange={() => handleSectorChange(sector)}
                          className="mb-2"
                        />
                      ))}
                    </Form.Group>
                    
                    <Button 
                      variant="outline-secondary" 
                      className="w-100"
                      onClick={() => setFilters({
                        type: '',
                        riskLevel: '',
                        minInvestment: '',
                        sectors: []
                      })}
                    >
                      Clear Filters
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Investments Grid */}
            <Col lg={9}>
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Showing {filteredInvestments.length} investments</h4>
                <Form.Select className="w-auto">
                  <option>Sort by: Featured</option>
                  <option>Sort by: Name (A-Z)</option>
                  <option>Sort by: Minimum Investment (Low to High)</option>
                  <option>Sort by: Expected Returns (High to Low)</option>
                </Form.Select>
              </div>
              
              <Row>
                {filteredInvestments.length > 0 ? (
                  filteredInvestments.map(investment => (
                    <Col key={investment.id} md={6} lg={4} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={investment.image} />
                        <Card.Body>
                          <Card.Title>{investment.name}</Card.Title>
                          <div className="mb-2">
                            <Badge 
                              bg={investment.riskLevel === 'low' ? 'success' : investment.riskLevel === 'medium' ? 'warning' : 'danger'}
                              className="me-2"
                            >
                              {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)} Risk
                            </Badge>
                            <Badge bg="info">
                              {investment.type.replace('_', ' ').charAt(0).toUpperCase() + investment.type.replace('_', ' ').slice(1)}
                            </Badge>
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
                      <h4>No investments match your filters</h4>
                      <p className="text-muted">Try adjusting your filter criteria</p>
                      <Button 
                        variant="primary"
                        onClick={() => setFilters({
                          type: '',
                          riskLevel: '',
                          minInvestment: '',
                          sectors: []
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
    </div>
  );
};

export default Investments;
