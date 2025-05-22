const mongoose = require('mongoose');

const assetConfigSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true, trim: true }, // e.g., 'btc', 'eth', 'usdt_erc20'
  name: { type: String, required: true }, // e.g., 'Bitcoin', 'Ethereum', 'Tether (ERC20)'
  symbol: { type: String, required: true }, // e.g., 'BTC', 'ETH', 'USDT'
  iconUrl: { type: String, default: '' },
  network: { type: String, required: true }, // e.g., 'Bitcoin', 'Ethereum (ERC20)'
  precision: { type: Number, required: true, default: 8 }, // Decimal places for display and calculations
  minDeposit: { type: String, required: true, default: '0' },
  canDeposit: { type: Boolean, default: true },
  withdrawalFee: { type: String, required: true, default: '0' }, // String for precision
  minWithdrawal: { type: String, required: true, default: '0' },
  maxWithdrawalPerTransaction: { type: String, default: null },
  maxWithdrawalDaily: { type: String, default: null },
  canWithdraw: { type: Boolean, default: true },
  supportsMemo: { type: Boolean, default: false }, // For assets like XRP, XLM that might need a destination tag/memo
  isActive: { type: Boolean, default: true } // To enable/disable the asset globally
}, { timestamps: true });

const AssetConfig = mongoose.model('AssetConfig', assetConfigSchema);

// Function to seed initial asset configurations
const seedAssetConfigs = async () => {
  try {
    const count = await AssetConfig.countDocuments();
    if (count === 0) {
      const assets = [
        {
          assetId: 'btc',
          name: 'Bitcoin',
          symbol: 'BTC',
          iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/btc.svg',
          network: 'Bitcoin',
          precision: 8,
          minDeposit: '0.0001',
          withdrawalFee: '0.00005',
          minWithdrawal: '0.0002',
          maxWithdrawalPerTransaction: '2.0',
          maxWithdrawalDaily: '10.0',
        },
        {
          assetId: 'eth',
          name: 'Ethereum',
          symbol: 'ETH',
          iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/eth.svg',
          network: 'Ethereum (ERC20)',
          precision: 18,
          minDeposit: '0.01',
          withdrawalFee: '0.001',
          minWithdrawal: '0.005',
          maxWithdrawalPerTransaction: '50.0',
          maxWithdrawalDaily: '200.0',
        },
        {
          assetId: 'usdt_erc20',
          name: 'Tether (ERC20)',
          symbol: 'USDT',
          iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25651/svg/color/usdt.svg',
          network: 'Ethereum (ERC20)',
          precision: 6, // USDT commonly has 6 decimal places for ERC20
          minDeposit: '10.00',
          withdrawalFee: '5.00',
          minWithdrawal: '20.00',
          maxWithdrawalPerTransaction: '5000.00',
          maxWithdrawalDaily: '20000.00',
        }
      ];
      await AssetConfig.insertMany(assets);
      console.log('Asset configurations seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding asset configurations:', error);
  }
};

module.exports = { AssetConfig, seedAssetConfigs };
