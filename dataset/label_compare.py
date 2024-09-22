from .dataset import LabelGroup

class LabelIndexCounter:
    def __init__(self) -> None:
        # first index is unanswered
        self.current_index = 1 
        self.labels_map = {}
    
    def add_label(self, label):
        if label not in self.labels_map:
            self.labels_map[label] = self.current_index + 1
            self.current_index += 1
    def get_count(self):
        return self.current_index + 1
    def get_index(self, label):
        return self.labels_map[label]

class LabelAnswerCompare:
    def __init__(self, user_count : int, label_group: LabelGroup) -> None:
        self.answers = []
        self.user_count = user_count
        self.users = {}
        self.answers_count = 0
        self.label_group = label_group

    def add_answer(self, label, user):
        self.answers.append(label)
        if label not in self.users:
            self.users[label] = []        
        self.users[label].append(user)
        self.answers_count += 1
    
    def get_counter(self):
        counted_answers = []
        for answer in self.answers:
            found = False
            for c in counted_answers:
                if answer == c["label"]:
                    found = True
                    c["count"] += 1
                    break
                if self.label_group.compare(answer, c["label"]):
                    # append to the "equal" label the other users
                    self.users[c["label"]].append(self.users[answer])
                    c["count"] += 1
                    found = True
                    break
            if not found:
                # add the new answer
                counted_answers.append({
                    "label" : answer,
                    "count" : 1
                })
        return counted_answers
    
    def get_agreement_row(self, label_indexer : LabelIndexCounter) -> list:
        counted_answers = self.get_counter()
        res = []
        # create a row of 0s
        for _ in range(0, label_indexer.get_count()):
            res.append(0)
        for c in counted_answers:
            index = label_indexer.get_index(c["label"])
            res[index] = c["count"]
        unanswered = self.user_count - self.answers_count
        res[0] = unanswered
        return res

    def return_dict(self) -> dict:        
        #counter = Counter(self.answers)
        counted_answers = self.get_counter()
        res = [
            {
                "label": c["label"],
                "count": c["count"],
                "percentage": c["count"] / self.user_count * 100  # Convert to percentage
            }
            for c in counted_answers
        ]
        if self.answers_count != self.user_count:
            res.append({
                "label": None,
                "count": self.user_count - self.answers_count,
                "percentage": (self.user_count - self.answers_count) / self.user_count * 100  # Convert to percentage
            })
        return res
    
    def return_dict_with_users(self) -> dict:
        #counter = Counter(self.answers)        
        counted_answers = self.get_counter()
        print("USERS:: ",self.users)
        return [
            {
                "label":  c["label"],
                "percentage": c["count"]  / self.user_count * 100,  # Convert to percentage
                "users" : self.users[c["label"]]
            }
            for c in counted_answers
        ]

    def get_answer_or_none(self) -> str | None:
        d = self.return_dict()
        if len(d) == 1 and d[0]["percentage"] == 100:
            return d[0]["label"]
        else:
            return None