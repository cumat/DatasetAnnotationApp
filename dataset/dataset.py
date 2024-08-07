
class HtmlView:
    def __init__(self) -> None:
        self.content = ""
    
    def add_html(self, content):
        self.content += content
        return self
    
    def add_text(self, text):
        self.content += f"<p>{text}</p>"
        return self

class LabelGroup:
    def __init__(self) -> None:
        pass

    def send_json(seld) -> str:
        pass

class TextLabelGroup(LabelGroup):
    def __init__(self) -> None:
        self.labels = []

    def add_label(self, label: str):
        self.labels.append(label)
        return self

    def send_json(self) -> str:
        return {
            "component":"text-labels",
            "data": self.labels
        }

class Data:
    def __init__(self, id: str, title: str, view : HtmlView, labels : LabelGroup) -> None:
        self.id = id
        self.title = title
        self.view = view
        self.labels = labels

class Dataset:
    def __init__(self, name: str, blank_labels : bool = True) -> None:
        self.name = name
        self.dataset = {}        
        self.dataset_order = []
        self.allow_blank_labels = blank_labels
    
    def add_data(self, data: Data):
        self.dataset[str(data.id)] = data
        self.dataset_order.append(data)
        return self
    
    def get_data_count(self) :
        return len(self.dataset)

    def get_indices_from_ids(self, ids):
        id_to_index = {str(data.id): idx for idx, data in enumerate(self.dataset_order)}
        return [id_to_index.get(id[0], -1) for id in ids]

    def get_dataset(self) -> list[Data]:
        return self.dataset_order
    def get_data(self, index: int) -> Data:
        return self.dataset_order[index]
    def get_data_by_id(self, id: str) -> Data:
        return self.dataset[id]
    
