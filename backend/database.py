import sqlite3

class Answer:
    def __init__(self, user : str, dataset: str, id: str, label: str) -> None:
        self.user = user
        self.dataset = dataset
        self.id = id
        self.label = label

class FinalAnswer:
    def __init__(self, dataset: str, id: str, label: str) -> None:
        self.dataset = dataset
        self.id = id
        self.label = label

class Database:
    def __init__(self) -> None:
        self.db_name = 'data.db'
        self.create_tables()

    def create_tables(self) -> None:
        conn = sqlite3.connect(self.db_name)
        cur = conn.cursor()
        cur.execute(''' 
                CREATE TABLE IF NOT EXISTS answers(
                                            p_id INTEGER PRIMARY KEY,
                                            user TEXT NOT NULL,
                                            dataset TEXT NOT NULL,
                                            id TEXT NOT NULL,
                                            label TEXT,
                                            UNIQUE(user, dataset, id)
                                            );
                    ''')
        cur.execute('''
                CREATE TABLE IF NOT EXISTS finalAnswers(
                            p_id INTEGER PRIMARY KEY,
                            dataset TEXT NOT NULL,
                            id TEXT NOT NULL,
                            label TEXT,
                            UNIQUE(dataset, id)
                            );
                    ''')
        conn.commit()
        cur.close()
    
    def get_user_answers(self, user: str, dataset: str):
        conn = sqlite3.connect(self.db_name)
        cur = conn.cursor()
        cur.execute('''
            SELECT id, label FROM answers WHERE dataset = ? AND user = ?
        ''', (dataset, user))        
        res = cur.fetchall()
        cur.close()
        conn.close()
        return res
    
    def get_user_answers_id(self, user: str, dataset: str):
        conn = sqlite3.connect(self.db_name)
        cur = conn.cursor()
        cur.execute('''
            SELECT id FROM answers WHERE dataset = ? AND user = ? AND label is not NULL
        ''', (dataset, user))
        res = cur.fetchall()
        cur.close()
        conn.close()
        return res

    def get_user_answer(self, user: str, dataset: str, id: str):
        conn = sqlite3.connect(self.db_name)
        cur = conn.cursor()
        cur.execute('''
            SELECT label FROM answers WHERE dataset = ? AND user = ? AND id = ?
        ''', (dataset, user, id))
        res = cur.fetchall()
        cur.close()
        conn.close()
        if res is None or len(res) == 0:
            return None
        else:
            return res[0][0]

    def insert_or_update_answer(self, answer : Answer):
        try:
            conn = sqlite3.connect(self.db_name)
            cur = conn.cursor()
            cur.execute('''
                INSERT OR REPLACE INTO answers (user, dataset, id, label) VALUES (?, ?, ?, ?)
            ''', (answer.user, answer.dataset, answer.id, answer.label))
            conn.commit()
            cur.close()
            conn.close()
        except sqlite3.IntegrityError as e:
            print(f"IntegrityError: {e}")
    
    def insert_or_update_final_answer(self, answer: FinalAnswer):
        try:
            conn = sqlite3.connect(self.db_name)
            cur = conn.cursor()
            cur.execute('''
                INSERT OR REPLACE INTO fixedAnswers (dataset, id, label) VALUES (?, ?, ?)
            ''', (answer.dataset, answer.id, answer.label))
            conn.commit()
            cur.close()
            conn.close()
        except sqlite3.IntegrityError as e:
            print(f"IntegrityError: {e}")