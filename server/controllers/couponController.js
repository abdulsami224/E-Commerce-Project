import Coupon from '../models/Coupon.js';

// Validate coupon — used in checkout
export const validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;
  try {
    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim()
    });

    // check exists
    if (!coupon)
      return res.status(404).json({ message: 'Invalid coupon code' });

    // check active
    if (!coupon.isActive)
      return res.status(400).json({ message: 'This coupon is no longer active' });

    // check expiry
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ message: 'This coupon has expired' });

    // check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });

    // check minimum order amount
    if (cartTotal < coupon.minOrderAmount)
      return res.status(400).json({
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount} required`
      });

    // calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    // discount cant exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalTotal: cartTotal - discountAmount,
      message: coupon.discountType === 'percentage'
        ? `${coupon.discountValue}% off applied!`
        : `Rs. ${coupon.discountValue} off applied!`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — create coupon
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase().trim()
    });
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Admin — toggle active/inactive
export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};