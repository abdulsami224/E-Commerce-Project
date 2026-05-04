import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: `"ShopApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password — ShopApp',
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background: #ef4444; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
            🛍️ ShopApp
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 12px;">
            Reset Your Password
          </h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>15 minutes</strong>.
          </p>

          <!-- Button -->
          <a href="${resetUrl}"
            style="display: inline-block; background: #ef4444; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Reset Password
          </a>

          <!-- Warning -->
          <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0; line-height: 1.6;">
            If you didn't request this, you can safely ignore this email. Your password will not be changed.
          </p>

          <!-- Link fallback -->
          <p style="color: #9ca3af; font-size: 11px; margin: 12px 0 0; word-break: break-all;">
            Or paste this link: ${resetUrl}
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
            © 2024 ShopApp · This is an automated email, please do not reply
          </p>
        </div>
      </div>
      ` 
  });
};


// ── Shared header/footer ──────────────────────────────────────
const emailHeader = `
  <div style="font-family:'DM Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#ef4444;padding:28px 32px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
        🛍️ ShopApp
      </h1>
    </div>
    <div style="padding:32px;">
`;

const emailFooter = `
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">
        © 2024 ShopApp · This is an automated email, please do not reply
      </p>
    </div>
  </div>
`;

// ── Order items table helper ──────────────────────────────────
const buildItemsTable = (items) => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <thead>
      <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb;">
        <th style="text-align:left;padding:10px 12px;font-size:12px;color:#6b7280;font-weight:600;">Product</th>
        <th style="text-align:center;padding:10px 12px;font-size:12px;color:#6b7280;font-weight:600;">Qty</th>
        <th style="text-align:right;padding:10px 12px;font-size:12px;color:#6b7280;font-weight:600;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr style="border-bottom:1px solid #f3f4f6;">
          <td style="padding:10px 12px;font-size:13px;color:#374151;">${item.product?.title || 'Product'}</td>
          <td style="padding:10px 12px;font-size:13px;color:#374151;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;font-size:13px;color:#374151;text-align:right;">Rs. ${item.price * item.quantity}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;

// ── 1. Order Confirmation Email ───────────────────────────────
export const sendOrderConfirmationEmail = async (email, order) => {
  const html = `
    ${emailHeader}
      <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Order Confirmed! 🎉</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.6;">
        Hi <strong>${order.userName}</strong>, thank you for your order! We've received it and will start processing shortly.
      </p>

      <!-- Order ID -->
      <div style="background:#f9fafb;border-radius:10px;padding:12px 16px;margin-bottom:20px;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">Order ID</p>
        <p style="margin:4px 0 0;font-size:13px;color:#374151;font-family:monospace;font-weight:600;">${order._id}</p>
      </div>

      <!-- Items -->
      <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 4px;">Items Ordered</p>
      ${buildItemsTable(order.items)}

      <!-- Price breakdown -->
      <div style="border-top:2px solid #f3f4f6;padding-top:12px;margin-top:4px;">
        ${order.discountAmount > 0 ? `
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:13px;color:#6b7280;">Discount (${order.couponCode})</span>
            <span style="font-size:13px;color:#22c55e;">− Rs. ${order.discountAmount}</span>
          </div>
        ` : ''}
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#6b7280;">Shipping</span>
          <span style="font-size:13px;color:#22c55e;font-weight:600;">Free</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:15px;font-weight:700;color:#1f2937;">Total</span>
          <span style="font-size:15px;font-weight:700;color:#ef4444;">Rs. ${order.totalPrice}</span>
        </div>
      </div>

      <!-- Shipping address -->
      <div style="background:#fef2f2;border-radius:10px;padding:12px 16px;margin-top:20px;border:1px solid #fecaca;">
        <p style="margin:0;font-size:12px;font-weight:600;color:#ef4444;">📦 Shipping To</p>
        <p style="margin:6px 0 0;font-size:13px;color:#374151;">
          ${order.shippingAddress?.street}, ${order.shippingAddress?.city}
        </p>
        <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">
          📞 ${order.shippingAddress?.phone}
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-top:24px;">
        <a href="${process.env.CLIENT_URL}/my-orders"
          style="display:inline-block;background:#ef4444;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Track Your Order
        </a>
      </div>
    ${emailFooter}
  `;

  await transporter.sendMail({
    from: `"ShopApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Order Confirmed — #${String(order._id).slice(-8).toUpperCase()}`,
    html,
  });
};

// ── 2. Order Shipped Email ────────────────────────────────────
export const sendOrderShippedEmail = async (email, order) => {
  const html = `
    ${emailHeader}
      <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Your Order is On Its Way! 🚚</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.6;">
        Hi <strong>${order.userName}</strong>, great news! Your order has been shipped and is heading your way.
      </p>

      <!-- Order ID -->
      <div style="background:#f9fafb;border-radius:10px;padding:12px 16px;margin-bottom:20px;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">Order ID</p>
        <p style="margin:4px 0 0;font-size:13px;color:#374151;font-family:monospace;font-weight:600;">${order._id}</p>
      </div>

      <!-- Items -->
      <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 4px;">Items Shipped</p>
      ${buildItemsTable(order.items)}

      <!-- Shipping address -->
      <div style="background:#eff6ff;border-radius:10px;padding:12px 16px;margin-top:16px;border:1px solid #bfdbfe;">
        <p style="margin:0;font-size:12px;font-weight:600;color:#3b82f6;">📍 Delivering To</p>
        <p style="margin:6px 0 0;font-size:13px;color:#374151;">
          ${order.shippingAddress?.street}, ${order.shippingAddress?.city}
        </p>
        <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">
          📞 ${order.shippingAddress?.phone}
        </p>
      </div>

      <!-- Timeline visual -->
      <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:10px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#374151;">Order Progress</p>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="text-align:center;">
            <div style="width:32px;height:32px;background:#22c55e;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;">
              <span style="color:white;font-size:14px;">✓</span>
            </div>
            <p style="font-size:10px;color:#22c55e;margin:4px 0 0;font-weight:600;">Placed</p>
          </div>
          <div style="flex:1;height:2px;background:#22c55e;margin:0 4px;margin-bottom:14px;"></div>
          <div style="text-align:center;">
            <div style="width:32px;height:32px;background:#22c55e;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;">
              <span style="color:white;font-size:14px;">✓</span>
            </div>
            <p style="font-size:10px;color:#22c55e;margin:4px 0 0;font-weight:600;">Processed</p>
          </div>
          <div style="flex:1;height:2px;background:#22c55e;margin:0 4px;margin-bottom:14px;"></div>
          <div style="text-align:center;">
            <div style="width:32px;height:32px;background:#ef4444;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;">
              <span style="color:white;font-size:16px;">🚚</span>
            </div>
            <p style="font-size:10px;color:#ef4444;margin:4px 0 0;font-weight:600;">Shipped</p>
          </div>
          <div style="flex:1;height:2px;background:#e5e7eb;margin:0 4px;margin-bottom:14px;"></div>
          <div style="text-align:center;">
            <div style="width:32px;height:32px;background:#e5e7eb;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:14px;">🏠</span>
            </div>
            <p style="font-size:10px;color:#9ca3af;margin:4px 0 0;">Delivered</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-top:24px;">
        <a href="${process.env.CLIENT_URL}/my-orders"
          style="display:inline-block;background:#ef4444;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Track Your Order
        </a>
      </div>
    ${emailFooter}
  `;

  await transporter.sendMail({
    from: `"ShopApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🚚 Your Order Has Been Shipped — #${String(order._id).slice(-8).toUpperCase()}`,
    html,
  });
};

// ── 3. Order Delivered Email ──────────────────────────────────
export const sendOrderDeliveredEmail = async (email, order) => {
  const html = `
    ${emailHeader}
      <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Order Delivered! 🎉</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.6;">
        Hi <strong>${order.userName}</strong>, your order has been delivered. We hope you love it!
      </p>

      <!-- Order ID -->
      <div style="background:#f0fdf4;border-radius:10px;padding:12px 16px;margin-bottom:20px;border:1px solid #bbf7d0;">
        <p style="margin:0;font-size:12px;color:#16a34a;font-weight:600;">✅ Successfully Delivered</p>
        <p style="margin:4px 0 0;font-size:13px;color:#374151;font-family:monospace;">Order #${String(order._id).slice(-8).toUpperCase()}</p>
      </div>

      <!-- Items -->
      <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 4px;">Items Delivered</p>
      ${buildItemsTable(order.items)}

      <!-- Review CTA -->
      <div style="background:#fef2f2;border-radius:10px;padding:16px;margin-top:16px;text-align:center;border:1px solid #fecaca;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1f2937;">
          ⭐ How was your experience?
        </p>
        <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
          Share your review and help others make better choices
        </p>
        <a href="${process.env.CLIENT_URL}/my-orders"
          style="display:inline-block;background:#ef4444;color:white;padding:10px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:13px;">
          Write a Review
        </a>
      </div>
    ${emailFooter}
  `;

  await transporter.sendMail({
    from: `"ShopApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `📦 Order Delivered — #${String(order._id).slice(-8).toUpperCase()}`,
    html,
  });
};

// ── 4. Order Cancelled Email ──────────────────────────────────
export const sendOrderCancelledEmail = async (email, order) => {
  const html = `
    ${emailHeader}
      <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Order Cancelled</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.6;">
        Hi <strong>${order.userName}</strong>, your order has been cancelled as requested.
      </p>

      <!-- Order ID -->
      <div style="background:#fef2f2;border-radius:10px;padding:12px 16px;margin-bottom:20px;border:1px solid #fecaca;">
        <p style="margin:0;font-size:12px;color:#ef4444;font-weight:600;">❌ Order Cancelled</p>
        <p style="margin:4px 0 0;font-size:13px;color:#374151;font-family:monospace;">Order #${String(order._id).slice(-8).toUpperCase()}</p>
      </div>

      <!-- Items -->
      <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 4px;">Cancelled Items</p>
      ${buildItemsTable(order.items)}

      <!-- Shop again CTA -->
      <div style="text-align:center;margin-top:24px;">
        <a href="${process.env.CLIENT_URL}"
          style="display:inline-block;background:#ef4444;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Continue Shopping
        </a>
      </div>
    ${emailFooter}
  `;

  await transporter.sendMail({
    from: `"ShopApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `❌ Order Cancelled — #${String(order._id).slice(-8).toUpperCase()}`,
    html,
  });
};

export default transporter;