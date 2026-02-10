import sqlite3
import os

DB_PATH = "fashion_fiesta.db"
TARGET_TOTAL = 5000

def prune_dataset():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Get current counts per category
    cursor.execute("""
        SELECT c.id, c.name, COUNT(p.id) as count 
        FROM category c 
        LEFT JOIN product p ON c.id = p.category_id 
        GROUP BY c.id
    """)
    categories = cursor.fetchall()
    
    current_total = sum(cat[2] for cat in categories)
    print(f"Current total products: {current_total}")
    
    if current_total <= TARGET_TOTAL:
        print("Dataset is already at or below target size.")
        conn.close()
        return

    # 2. Calculate target per category (proportional)
    # We'll use a ratio but ensure at least 1 if the category isn't empty
    ratio = TARGET_TOTAL / current_total
    
    ids_to_keep = []
    
    print("\nPlanning reduction:")
    actual_keep_count = 0
    for cat_id, cat_name, count in categories:
        if count == 0:
            continue
            
        keep_count = max(1, int(count * ratio))
        # Adjust for the last category or rounding errors later if needed
        # For now, just select the top N for this category
        
        # Prioritize products with embeddings, then by ID (usually newest)
        cursor.execute("""
            SELECT id FROM product 
            WHERE category_id = ? 
            ORDER BY (embedding IS NOT NULL) DESC, id DESC
            LIMIT ?
        """, (cat_id, keep_count))
        
        selected_ids = [row[0] for row in cursor.fetchall()]
        ids_to_keep.extend(selected_ids)
        actual_keep_count += len(selected_ids)
        print(f" - {cat_name}: Keeping {len(selected_ids)} / {count}")

    print(f"\nTotal planned to keep: {actual_keep_count}")

    # 3. Perform Deletion
    # We delete everything NOT in our keep list
    if ids_to_keep:
        print("Deleting remaining records...")
        # Using a temporary table for efficiency if the list is huge, 
        # but for 5k it's manageable with a large IN clause or temp table
        cursor.execute("CREATE TEMP TABLE ids_to_keep (id INTEGER PRIMARY KEY)")
        cursor.executemany("INSERT INTO ids_to_keep VALUES (?)", [(id,) for id in ids_to_keep])
        
        cursor.execute("DELETE FROM product WHERE id NOT IN (SELECT id FROM ids_to_keep)")
        print(f"Deleted {cursor.rowcount} products.")
        
        conn.commit()
    
    # 4. Vacuum to reclaim space
    print("Vacuuming database...")
    conn.execute("VACUUM")
    
    # 5. Final check
    cursor.execute("SELECT COUNT(*) FROM product")
    final_count = cursor.fetchone()[0]
    print(f"Final product count: {final_count}")

    conn.close()
    print("\nPruning complete! Your dataset is now optimized for performance. 👕🚀")

if __name__ == "__main__":
    prune_dataset()
