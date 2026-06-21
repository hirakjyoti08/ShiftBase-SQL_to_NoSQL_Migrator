# ShiftBase: SQL to NoSQL Migrator with Performance Evaluation

A powerful and automated tool designed to migrate relational databases (**SQL**) into document-based **NoSQL** databases efficiently. This project focuses on transforming structured relational schemas into flexible NoSQL formats while preserving data integrity and relationships.

---

## Overview

Modern applications increasingly rely on **NoSQL databases** for scalability and flexibility. However, migrating from traditional SQL systems is challenging due to differences in schema design, relationships, and data modeling.

**ShiftBase** solves this by:
- Extracting SQL schema and data
- Transforming relational structures into NoSQL documents
- Automatically generating collections for NoSQL databases

This project demonstrates a complete pipeline for **SQL → NoSQL migration**, including schema extraction, transformation, and loading.

---

## Features

- 🔄 Automated SQL to NoSQL migration  
- 🧠 Intelligent schema transformation (Normalization → Denormalization)  
- 🔗 Relationship handling (Primary keys, Foreign keys)  
- 📂 JSON-based intermediate representation  
- ⚡ Efficient data processing pipeline  
- 🛠 Modular and extensible architecture  

---
## Technologies Used

| Database     | Driver          | Language     |
|--------------|-----------------|--------------|
| MySQL        | `mysql-connector-python` | Python       |
| MongoDB      | `pymongo`, `motor` | Python       |
| Apache Spark | `pyspark`       | Python       |

---

## Prerequisites

- Python 3.8+
- MySQL server running
- MongoDB server running
- Apache Spark installed
- Required Python packages (see `requirements.txt`)

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hirakjyotitalukdar/ShiftBase-SQL_to_NoSQL_Migrator.git
cd ShiftBase-SQL_to_NoSQL_Migrator
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure database connections in `config/` directory

---

## Configuration

Configure your database connections in the following files:

- `config/mysql_config.py`: MySQL database credentials
- `config/mongodb_config.py`: MongoDB connection details
- `config/spark_config.py`: Spark session configuration

Example `mysql_config.py`:
```python
MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_password",
    "database": "your_database"
}
```

Example `mongodb_config.py`:
```python
MONGODB_CONFIG = {
    "uri": "mongodb://localhost:27017/",
    "database": "your_database"
}
```

---

## Execution

Run the migration script:
```bash
python main.py
```

The script will perform the following steps:

1. **Extract** schema and data from MySQL
2. **Transform** relational data to denormalized format
3. **Map** to MongoDB document structure
4. **Load** data to MongoDB collections
5. **Map** to Cassandra table structure
6. **Load** data to Cassandra tables

---

## 📂 Project Structure

```
ShiftBase-SQL_to_NoSQL_Migrator/
│
├── src/
│   ├── extractor/           # SQL schema extraction
│   │   ├── __init__.py
│   │   └── mysql_extractor.py
│   │
│   ├── transformer/         # Data transformation
│   │   ├── __init__.py
│   │   ├── transformer.py
│   │   └── mappings.py
│   │
│   ├── loader/              # NoSQL loading
│   │   ├── __init__.py
│   │   ├── mongodb_loader.py
│   │   └── cassandra_loader.py
│   │
│   └── utils/               # Helper functions
│       ├── __init__.py
│       ├── spark_utils.py
│       └── config_loader.py
│
├── config/
│   ├── mysql_config.py
│   ├── mongodb_config.py
│   ├── cassandra_config.py
│   └── spark_config.py
│
├── data/
│   ├── temp/                # Temporary files
│   └── tpc-h/               # TPCH dataset
│
├── scripts/
│   └── run_migration.sh     # Execution script
│
├── main.py                  # Main entry point
├── requirements.txt         # Dependencies
├── README.md                # Project documentation
└── .gitignore               # Git ignore file
```

---

## Schema Transformation

### Normalization (SQL)
```
CUSTOMER --1:N-- ORDER --1:N-- LINEITEM
```

### Denormalization (NoSQL)
```
CUSTOMER
└─ ORDERS[]
   └─ LINEITEMS[]
```

---

## Migration Flow

1. **Connect** to MySQL database
2. **Extract** schema and relationships
3. **Generate** intermediate JSON representation
4. **Transform** to denormalized documents
5. **Partition** data for optimal NoSQL storage
6. **Load** into MongoDB collections
7. **Load** into Cassandra tables

---

## Key Features

### Automated Schema Extraction
- Automatically detects tables and relationships
- Extracts primary and foreign key constraints

### Intelligent Denormalization
- Converts normalized tables to nested documents
- Preserves all data relationships
- Optimizes for NoSQL query patterns

### Data Partitioning
- Range partitioning for MongoDB
- Hash partitioning for Cassandra
- Improves query performance

### Modular Architecture
- Extensible design for adding new databases
- Easy to integrate with existing systems
- Separate configuration for each database

---

## Sample Output

### MongoDB Document
```json
{
  "_id": 1,
  "name": "Customer Name",
  "address": "Customer Address",
  "orders": [
    {
      "order_id": 101,
      "order_date": "2023-01-01",
      "lineitems": [
        {
          "product_id": 5,
          "quantity": 2,
          "price": 100.00
        }
      ]
    }
  ]
}
```

### Cassandra Table Schema
```cql
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name TEXT,
    address TEXT,
    orders LIST<FROZEN<order>>
);

CREATE TYPE order (
    order_id INT,
    order_date DATE,
    lineitems LIST<FROZEN<lineitem>>
);

CREATE TYPE lineitem (
    product_id INT,
    quantity INT,
    price DECIMAL
);
```


---

## Documentation

- [Configuration Guide](config/README.md)
- [Data Transformation Logic](src/transformer/README.md)
- [Migration Process](README.md#migration-flow)

---

## Customization

To add support for other SQL databases:

1. Create a new extractor in `src/extractor/`
2. Implement the extraction logic
3. Update `config/` with database credentials
4. Modify `main.py` to include the new extractor

To add support for other NoSQL databases:

1. Create a new loader in `src/loader/`
2. Implement the loading logic
3. Update `config/` with database credentials
4. Modify `main.py` to include the new loader

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<<<<<<< HEAD
## Contact

Hirakjyoti Talukdar - [work.hirakk@gmail.com]

---

=======
>>>>>>> fd05b28 (chore: update JMeter performance test results and documentation)
## Acknowledgments

- **Apache Spark** - Distributed data processing
- **TPC-H Benchmark** - Standard dataset for database benchmarking
- **NoSQL Databases** - For providing scalable data storage solutions
