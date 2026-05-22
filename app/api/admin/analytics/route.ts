import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [metrics, revenueRows, statusRows, recentOrders, recentSignups, locationRows] = await Promise.all([
      sql`
        SELECT
          (SELECT COALESCE(SUM(total), 0) FROM "Order" WHERE status != 'refunded') AS revenue,
          (SELECT COUNT(*) FROM "Order" WHERE "createdAt"::date = CURRENT_DATE) AS orders_today,
          (SELECT COUNT(*) FROM "Order" WHERE status = 'processing') AS pending,
          (SELECT COUNT(*) FROM "Customer" WHERE role = 'customer') AS customers,
          (SELECT COUNT(*) FROM "Product" WHERE "stockCount" <= "lowStockAt") AS low_stock_products,
          (SELECT "stockCount" FROM "Product" LIMIT 1) AS stock_count
      `,
      sql`
        SELECT DATE("createdAt") AS date, COALESCE(SUM(total), 0) AS revenue
        FROM "Order"
        WHERE "createdAt" >= NOW() - INTERVAL '7 days'
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      sql`
        SELECT status, COUNT(*) AS count
        FROM "Order"
        GROUP BY status
      `,
      sql`
        SELECT o.id, o.status, o.total, o."createdAt", o.email,
               COALESCE(c."firstName" || ' ' || c."lastName", o.email) AS customer,
               (SELECT name FROM "OrderItem" WHERE "orderId" = o.id LIMIT 1) AS variant
        FROM "Order" o
        LEFT JOIN "Customer" c ON c.id = o."customerId"
        ORDER BY o."createdAt" DESC
        LIMIT 5
      `,
      sql`
        SELECT "firstName" || ' ' || "lastName" AS name, email, "createdAt"
        FROM "Customer"
        WHERE role = 'customer'
        ORDER BY "createdAt" DESC
        LIMIT 5
      `,
      sql`
        SELECT
          COALESCE(a.country, 'Unknown') AS country,
          COUNT(*) AS order_count,
          COALESCE(SUM(o.total), 0) AS revenue
        FROM "Order" o
        LEFT JOIN "Address" a ON a."orderId" = o.id
        GROUP BY a.country
        ORDER BY order_count DESC
        LIMIT 8
      `,
    ]);

    return NextResponse.json({
      metrics: metrics[0],
      revenueChart: revenueRows,
      statusBreakdown: statusRows,
      recentOrders,
      recentSignups,
      locations: locationRows,
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
