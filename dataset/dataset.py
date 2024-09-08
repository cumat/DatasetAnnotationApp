from dataset.labels import TextLabelGroup, NumberLabelGroup, ImageLabelGroup, TimestampLabelGroup, LabelGroup, NumberValueType, MultiImageLabelGroup, MultiTimestampLabelGroup

class HtmlView:
    def __init__(self) -> None:
        self.content = ""
    
    def add_html(self, content):
        self.content += content
        return self
    
    def add_style(self, res_source : str):
        self.content += f'<link rel="stylesheet" href="{res_source}">'
        return self
    
    def add_text(self, text):
        self.content += f"<p>{text}</p>"
        return self
    
    def add_img(self, source : str, id: str | None):
        if id:
            self.content += (f'<img id={id} src="{source}" width="500">')
        else:
            self.content += (f'<img src="{source}" width="500">')
        return self
    
    def add_video(self, source: str, type: str='video/mp4', id: str | None = None):
        id_str = ""
        if id:
            id_str= f"id={id}"
        # max video width = 1280px
        self.content += (f'''
                            <div style="display: flex; width: 100%; max-width:1408px; justify-content: center;">
                                <video {id_str} width="90%" preload="auto" controls>
                                    <source src="{source}" type="{type}">
                                    Your browser does not support the video tag.
                                </video>
                            </div>''')
        return self
    
    def add_audio(self, source: str, type: str='video/mp4', id: str | None = None):
        id_str = ""
        if id:
            id_str= f"id={id}"
        # max video width = 1280px
        self.content += (f'''
                            <div style="display: flex; width: 100%; max-width:1408px; justify-content: center;">
                                <audio {id_str} width="90%" preload="auto" controls>
                                    <source src="{source}" type="{type}">
                                    Your browser does not support the audio tag.
                                </audio>
                            </div>''')
        return self
    
    def add_external_html(self, source_path:str):
        try:
            with open(source_path, 'r') as file:
                content = file.read()
                self.content += ('\n' + content + '\n')
            return self
        except Exception as e:
            self.content += (f'\nError loading {source_path}, {e}\n')
            return self


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
        if str(data.id) in self.dataset:
            raise ValueError(f"Data with id '{data.id}' already exists in the dataset.")
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
    
