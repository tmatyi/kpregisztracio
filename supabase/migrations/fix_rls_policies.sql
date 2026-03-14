-- Drop existing policies that query auth.users
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

-- Recreate orders SELECT policy without querying auth.users
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IS NULL  -- Allow anonymous users to view orders by email (handled in app logic)
  );

-- Recreate order_items SELECT policy without querying auth.users
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Ensure order_items INSERT policy doesn't query auth.users
DROP POLICY IF EXISTS "Users can create order items for their orders" ON order_items;

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);
