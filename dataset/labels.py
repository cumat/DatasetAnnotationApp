import sys

class LabelGroup:
    def __init__(self) -> None:
        pass

    def send_json(self) -> str:
        pass

    def compare(self, data1, data2) -> bool:
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
    def compare(self, data1, data2) -> bool:
        if(data1 == data2):
            return True
        else:
            return False

class NumberValueType:
    INT = 1
    FLOAT = 2

class NumberLabelGroup(LabelGroup):
    def __init__(self,min: float = sys.float_info.min, max:float = sys.float_info.max, 
                 value_type : NumberValueType = NumberValueType.FLOAT) -> None:
        self.min = min
        self.max = max
        self.value_type = value_type

    def value_type_to_js(self):
        if self.value_type == NumberValueType.INT:
            return "1"
        else:
            return "0.01"
        
    def send_json(self) -> str:
        return {
            "component":"number-labels",
            "data": {
                'min' : self.min,
                'max' : self.max,
                'step' : self.value_type_to_js()
            }
        }
    
    def compare(self, data1, data2) -> bool:
        if(self.value_type == NumberValueType.FLOAT):
            if round(float(data1)) == round(float(data2)):
                return True
            else:
                return False
        if(data1 == data2):
            return True
        else:
            return False


class ImageLabelGroup(LabelGroup):
    def __init__(self, img_id : str) -> None:
        self.img_id = img_id

    def send_json(self) -> str:
        return {
            "component":"image-label",
            "data": {
                "imageId" : self.img_id
            }
        }
    def compare(self, data1, data2) -> bool:
        if(data1 == data2):
            return True
        else:
            return False
        
class TimestampLabelGroup(LabelGroup):
    def __init__(self, media_id : str) -> None:
        self.media_id = media_id

    def send_json(self) -> str:
        return {
            "component":"timestamp-label",
            "data": {
                "mediaId" : self.media_id
            }
        }
    def compare(self, data1, data2) -> bool:
        if(data1 == data2):
            return True
        else:
            return False