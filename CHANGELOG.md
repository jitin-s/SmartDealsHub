# 📋 Changelog (Summer 2026 Release Milestone)

## [1.1.0] - 2026-07-31
### Added
- **Dynamic Price Normalization**: Full ISO currency symbol mapping (INR, USD, EUR, GBP, CAD, AUD) with multi-decimal sanitization.
- **Price Drop Threshold Monitor**: Evaluates target thresholds and minimum 20% drops with lowest-ever historical tracking.
- **Affiliate & Redirect Protection**: Safe affiliate URL builder with UTM injection, tracking param stripping, and expired coupon flags.
- **Deal Card & Category Filtering**: Interactive category pills (Electronics, Fashion, Home, Travel), discount badges, and sort toggles.
- **Caching Layer**: 15-minute in-memory TTL caching for top deals and trending flash radar.
- **Unit Test Suite**: Full coverage across price parsers, retry handlers, affiliate sanitizers, and tracker math.
