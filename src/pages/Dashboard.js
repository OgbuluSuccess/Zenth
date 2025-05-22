import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Form, InputGroup, Dropdown, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';

// Register ChartJS components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  
  // App color scheme
  const appColors = {
    primary: '#192a56',
    primaryGradient: 'linear-gradient(to right, #192a56, #1c2e59)',
    secondary: '#21d397',
    secondaryGradient: 'linear-gradient(to right, #21d397 0%, #7450fe 100%)',
    textLight: '#ffffff',
    textDark: '#333333',
    accent: '#f7913a',  // Orange accent color from the reference image
    chartColors: {
      bitcoin: '#F7931A',
      ethereum: '#627EEA',
      xrp: '#23292F',
      ltc: '#345D9D',
      zec: '#ECB244'
    }
  };

  // Sample user data - in a real app, this would come from your API
  const [userData, setUserData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    accountBalance: 418.43,
    totalInvestment: 3708.00,
    totalReturns: 0.00,
    portfolioValue: 3708.00,
    recentTransactions: [
      { id: 1, type: 'deposit', amount: 500, date: '2025-05-15', status: 'completed' },
      { id: 2, type: 'investment', amount: 1000, date: '2025-05-14', status: 'completed' },
      { id: 3, type: 'withdrawal', amount: 200, date: '2025-05-10', status: 'pending' }
    ],
    notifications: [
      { id: 1, message: 'Your deposit of $500 has been processed', date: '2025-05-19', read: false },
      { id: 2, message: 'New investment opportunity: Tech Growth Fund', date: '2025-05-18', read: true },
      { id: 3, message: 'Your monthly portfolio report is ready', date: '2025-05-17', read: true }
    ]
  });

  // Market data
  const [marketData, setMarketData] = useState({
    buyPrice: 45678.90,
    sellPrice: 45123.45,
    volume: 2345678,
    change: 2.34,
    marketCap: 876543210,
    supply: 18700000,
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Market Price',
          data: [42000, 44000, 41000, 43000, 44500, 45678],
          borderColor: '#F7931A',
          backgroundColor: 'rgba(247, 147, 26, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }
  });

  // Order data
  const [orderData, setOrderData] = useState({
    selectedCoin: 'BTC',
    buyOrders: [
      { id: 1, price: 45123.45, amount: 0.25, total: 11280.86, time: '12:30:45' },
      { id: 2, price: 45100.00, amount: 0.5, total: 22550.00, time: '12:29:30' },
      { id: 3, price: 45050.75, amount: 0.1, total: 4505.08, time: '12:28:15' }
    ],
    sellOrders: [
      { id: 1, price: 45700.00, amount: 0.3, total: 13710.00, time: '12:31:20' },
      { id: 2, price: 45750.50, amount: 0.2, total: 9150.10, time: '12:32:05' },
      { id: 3, price: 45800.25, amount: 0.15, total: 6870.04, time: '12:33:40' }
    ]
  });

  // Format number with commas and 2 decimal places
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [2500, 2700, 3000, 3200, 3500, 3708],
        borderColor: '#21d397',
        backgroundColor: 'rgba(33, 211, 151, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div>
      {/* Bootstrap Dashboard */}
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Dashboard</h2>
              <div>
                <Button variant="outline-secondary" className="me-2">Export</Button>
                <Button variant="primary">+ New Transaction</Button>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Investment Summary Cards */}
        <Row className="mb-4">
          {/* Current Balance Card */}
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100" style={{ 
              borderRadius: '15px', 
              border: 'none', 
              overflow: 'hidden',
              background: 'linear-gradient(45deg, #1c2e59, #192a56)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
              <Card.Body className="position-relative">
                <h6 className="text-white mb-3">Current Balance</h6>
                <h2 className="text-white mb-3">${formatNumber(userData.accountBalance)}</h2>
                <div className="d-flex">
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="text-white" 
                    style={{ borderRadius: '20px', fontSize: '0.8rem' }}
                  >
                    Add
                  </Button>
                </div>
                <div 
                  className="position-absolute" 
                  style={{ 
                    top: '15px', 
                    right: '15px', 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    backgroundColor: appColors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}
                >
                  <i className="fa fa-dollar-sign"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Total Profit Card */}
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100" style={{ 
              borderRadius: '15px', 
              border: 'none', 
              overflow: 'hidden',
              background: 'linear-gradient(45deg, #1c2e59, #192a56)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
              <Card.Body className="position-relative">
                <h6 className="text-white mb-3">Total Profit</h6>
                <h2 className="text-white mb-3">${formatNumber(userData.totalReturns || 0.00)}</h2>
                <div className="d-flex">
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="text-white" 
                    style={{ borderRadius: '20px', fontSize: '0.8rem' }}
                  >
                    Withdraw
                  </Button>
                </div>
                <div 
                  className="position-absolute" 
                  style={{ 
                    top: '15px', 
                    right: '15px', 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    backgroundColor: appColors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}
                >
                  <i className="fa fa-chart-line"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Total Plan Invest Card */}
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100" style={{ 
              borderRadius: '15px', 
              border: 'none', 
              overflow: 'hidden',
              background: 'linear-gradient(45deg, #1c2e59, #192a56)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
              <Card.Body className="position-relative">
                <h6 className="text-white mb-3">Total Plan Invest</h6>
                <h2 className="text-white mb-3">${formatNumber(userData.totalInvestment || 3708.00)}</h2>
                <div className="d-flex">
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="text-white" 
                    style={{ borderRadius: '20px', fontSize: '0.8rem' }}
                  >
                    View
                  </Button>
                </div>
                <div 
                  className="position-absolute" 
                  style={{ 
                    top: '15px', 
                    right: '15px', 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    backgroundColor: appColors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}
                >
                  <i className="fa fa-arrow-circle-right"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Portfolio Value Card */}
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100" style={{ 
              borderRadius: '15px', 
              border: 'none', 
              overflow: 'hidden',
              background: 'linear-gradient(45deg, #1c2e59, #192a56)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
              <Card.Body className="position-relative">
                <h6 className="text-white mb-3">Portfolio Value</h6>
                <h2 className="text-white mb-3">${formatNumber(userData.portfolioValue || 3708.00)}</h2>
                <div className="d-flex">
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="text-white" 
                    style={{ borderRadius: '20px', fontSize: '0.8rem' }}
                  >
                    Details
                  </Button>
                </div>
                <div 
                  className="position-absolute" 
                  style={{ 
                    top: '15px', 
                    right: '15px', 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    backgroundColor: appColors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}
                >
                  <i className="fa fa-wallet"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Market Overview Section */}
        <Row className="mb-4">
          <Col lg={8} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden', border: 'none' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Market Overview</h5>
                  <div>
                    <Button variant="outline-secondary" size="sm" className="me-2">Week</Button>
                    <Button variant="primary" size="sm" className="me-2">Month</Button>
                    <Button variant="outline-secondary" size="sm">Year</Button>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <small className="text-muted d-block">Buy Price</small>
                    <h4 className="mb-0">${formatNumber(marketData.buyPrice)}</h4>
                  </div>
                  <div className="text-end">
                    <small className="text-muted d-block">Sell Price</small>
                    <h4 className="mb-0">${formatNumber(marketData.sellPrice)}</h4>
                  </div>
                </div>
                
                <div style={{ height: '250px' }}>
                  <Line data={marketData.chartData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm h-100" style={{ borderRadius: '15px', overflow: 'hidden', border: 'none' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Buy / Sell Orders</h5>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm" id="dropdown-coin">
                      {orderData.selectedCoin}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>BTC</Dropdown.Item>
                      <Dropdown.Item>ETH</Dropdown.Item>
                      <Dropdown.Item>DASH</Dropdown.Item>
                      <Dropdown.Item>XRP</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                
                <Tabs defaultActiveKey="buy" className="mb-3">
                  <Tab eventKey="buy" title="Buy Orders">
                    <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <Table className="table-sm" style={{ fontSize: '0.85rem' }}>
                        <thead>
                          <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.buyOrders.map(order => (
                            <tr key={order.id}>
                              <td className="text-success">${formatNumber(order.price)}</td>
                              <td>{order.amount}</td>
                              <td>${formatNumber(order.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                  <Tab eventKey="sell" title="Sell Orders">
                    <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <Table className="table-sm" style={{ fontSize: '0.85rem' }}>
                        <thead>
                          <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.sellOrders.map(order => (
                            <tr key={order.id}>
                              <td className="text-danger">${formatNumber(order.price)}</td>
                              <td>{order.amount}</td>
                              <td>${formatNumber(order.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                </Tabs>
                
                <div className="mt-3">
                  <Form>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Amount</Form.Label>
                          <InputGroup>
                            <Form.Control type="number" placeholder="0.00" />
                            <InputGroup.Text>BTC</InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Price</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control type="number" placeholder="0.00" />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-grid gap-2">
                      <Button variant="success" className="mb-2">Buy BTC</Button>
                      <Button variant="danger">Sell BTC</Button>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Recent Transactions */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden', border: 'none' }}>
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Transactions</h5>
                  <Button variant="link" className="text-decoration-none">View All</Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table className="table-hover">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.recentTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  borderRadius: '50%', 
                                  backgroundColor: transaction.type === 'deposit' ? '#e3f9f0' : transaction.type === 'withdrawal' ? '#fde8e8' : '#e6f2ff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: '10px',
                                  color: transaction.type === 'deposit' ? '#21d397' : transaction.type === 'withdrawal' ? '#f87171' : '#3b82f6'
                                }}
                              >
                                {transaction.type === 'deposit' ? (
                                  <i className="fa fa-arrow-up"></i>
                                ) : transaction.type === 'withdrawal' ? (
                                  <i className="fa fa-arrow-down"></i>
                                ) : (
                                  <i className="fa fa-wallet"></i>
                                )}
                              </div>
                              <div>
                                <span className="d-block fw-medium">
                                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{transaction.date}</td>
                          <td>
                            <span className={transaction.type === 'deposit' ? 'text-success' : transaction.type === 'withdrawal' ? 'text-danger' : 'text-primary'}>
                              {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                              ${formatNumber(transaction.amount)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${transaction.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <Button variant="outline-secondary" size="sm">Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
