import "dotenv/config";
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();
const PORT = process.env.PORT || 5002;

// ── Global middlewares ────────────────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));

// Important: Parse raw body for Stripe webhook verification
app.use(['/payments/webhook', '/api/payments/webhook'], express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/uploads", express.static("uploads"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/marketplace", marketplaceRoutes);
app.use("/admin", adminRoutes);
app.use("/notifications", notificationRoutes);
app.use("/chat", chatRoutes);
app.use("/tracking", trackingRoutes);
app.use("/orders", ordersRoutes);
app.use("/payments", paymentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/cart", cartRoutes);

app.get("/", (_req, res) => {
  const brevoKey = process.env.BREVO_API_KEY || 
                   process.env.brevo_api_key || 
                   process.env.Brevo_Api_Key || 
                   process.env.BERVO_API_KEY || 
                   process.env.bervo_api_key ||
                   process.env.SENDINBLUE_API_KEY ||
                   process.env.sendinblue_api_key;
  
  res.json({ 
    status: "ok", 
    project: "Zar3a API 🌱", 
    version: "2.0.0 (Refactored)",
    diagnostics: {
      brevoKeyLoaded: !!brevoKey,
      brevoKeyMasked: brevoKey ? `${brevoKey.trim().replace(/^["']|["']$/g, '').slice(0, 12)}...` : null
    }
  });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const ensureProductionColumns = async (sequelizeInstance) => {
  try {
    console.log("Checking for missing database columns in Users...");
    
    // Check status column
    const [statusCols] = await sequelizeInstance.query("SHOW COLUMNS FROM `Users` LIKE 'status';");
    if (statusCols.length === 0) {
      console.log("Adding 'status' column to Users...");
      await sequelizeInstance.query(`
        ALTER TABLE \`Users\` 
        ADD COLUMN \`status\` ENUM('pending', 'pending_sensor', 'pending_second_approval', 'approved') 
        NOT NULL DEFAULT 'pending';
      `);
      console.log("✅ 'status' column added.");
    }

    // Check subscriptionTier column
    const [subTierCols] = await sequelizeInstance.query("SHOW COLUMNS FROM `Users` LIKE 'subscriptionTier';");
    if (subTierCols.length === 0) {
      console.log("Adding 'subscriptionTier' column to Users...");
      await sequelizeInstance.query(`
        ALTER TABLE \`Users\` 
        ADD COLUMN \`subscriptionTier\` ENUM('FREE', 'STARTER', 'GROWTH', 'PRO') 
        NOT NULL DEFAULT 'FREE';
      `);
      console.log("✅ 'subscriptionTier' column added.");
    }

    // Check subscriptionExpiresAt column
    const [subExpCols] = await sequelizeInstance.query("SHOW COLUMNS FROM `Users` LIKE 'subscriptionExpiresAt';");
    if (subExpCols.length === 0) {
      console.log("Adding 'subscriptionExpiresAt' column to Users...");
      await sequelizeInstance.query(`
        ALTER TABLE \`Users\` 
        ADD COLUMN \`subscriptionExpiresAt\` DATETIME NULL DEFAULT NULL;
      `);
      console.log("✅ 'subscriptionExpiresAt' column added.");
    }

    // Ensure imageUrl column lengths are modified to TEXT to support long base64 and URLs
    const tablesToAlter = [
      { table: 'ExpertListings', column: 'imageUrl' },
      { table: 'Products', column: 'imageUrl' },
      { table: 'OrderItems', column: 'imageUrl' },
      { table: 'OrderTracking', column: 'imageUrl' }
    ];

    for (const item of tablesToAlter) {
      try {
        const [cols] = await sequelizeInstance.query(`SHOW COLUMNS FROM \`${item.table}\` LIKE '${item.column}';`);
        if (cols.length > 0) {
          const type = cols[0].Type.toLowerCase();
          if (type.includes('varchar')) {
            console.log(`Altering \`${item.table}\`.\`${item.column}\` from ${type} to TEXT...`);
            await sequelizeInstance.query(`ALTER TABLE \`${item.table}\` MODIFY COLUMN \`${item.column}\` TEXT;`);
            console.log(`✅ \`${item.table}\`.\`${item.column}\` modified to TEXT.`);
          }
        }
      } catch (colErr) {
        console.error(`⚠️ Could not alter column ${item.column} in table ${item.table}:`, colErr.message);
      }
    }
  } catch (err) {
    console.error("⚠️ Error while checking/adding columns in ensureProductionColumns:", err.message);
  }
};

// ── Boot & Database Sync ──────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Programmatically ensure production columns are present before sync check
    await ensureProductionColumns(sequelize);

    // We synchronize tables but avoid alter: true on MySQL to prevent key/index bloat (ER_TOO_MANY_KEYS)
    await sequelize.sync();
    console.log("✅ Database connected & synced");

    app.listen(PORT, () => {
      console.log(`\n🌱 Zar3a API is running (Refactored v2.0.0)`);
      console.log(`    Local  →  http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};
startServer();
// Nodemon reload trigger 3