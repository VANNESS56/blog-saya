-- Hapus foreign key lama
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_stock_id_fkey;

-- Tambahkan foreign key baru yang mengizinkan penghapusan stock (ON DELETE SET NULL)
ALTER TABLE orders 
ADD CONSTRAINT orders_stock_id_fkey 
FOREIGN KEY (stock_id) 
REFERENCES product_stock(id) 
ON DELETE SET NULL;
