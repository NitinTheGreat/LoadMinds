import pymysql
import sys

# Database connection parameters
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = 'thegreat1'
DB_NAME = 'taskflow'

def run_migration():
    try:
        # Connect to the database
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        
        print(f"Connected to database: {DB_NAME}")
        
        with connection.cursor() as cursor:
            # Check if description column exists
            cursor.execute("SHOW COLUMNS FROM task LIKE 'description'")
            if not cursor.fetchone():
                print("Adding 'description' column...")
                cursor.execute("ALTER TABLE task ADD COLUMN description TEXT")
                print("'description' column added successfully")
            else:
                print("'description' column already exists")
            
            # Check if priority column exists
            cursor.execute("SHOW COLUMNS FROM task LIKE 'priority'")
            if not cursor.fetchone():
                print("Adding 'priority' column...")
                cursor.execute("ALTER TABLE task ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'")
                print("'priority' column added successfully")
            else:
                print("'priority' column already exists")
            
            # Commit the changes
            connection.commit()
            print("Migration completed successfully")
            
    except Exception as e:
        print(f"Error during migration: {e}")
        sys.exit(1)
    finally:
        if 'connection' in locals():
            connection.close()
            print("Database connection closed")

if __name__ == "__main__":
    run_migration()