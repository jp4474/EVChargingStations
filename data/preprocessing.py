# pip install geopy
# pip install googletrans==3.1.0a0

import pandas as pd
from geopy.geocoders import Nominatim
from googletrans import Translator

geo_local = Nominatim(user_agent='South Korea')

def geocoding(address):
    latitude,  longitude = geo_local.geocode(address)
    return latitude, longitude
    
if __name__ == "__main__":
    df = pd.read_csv("ev_charging_stations.csv", encoding="cp949")

    df1 = pd.read_csv("gas_stations_seoul.csv", encoding="cp949")
    translator = Translator()

    #TODO: translate only the columns we need to reduce running time
    #for column in df1.columns:
        #print(column)
        #df1[column] = df1[column].apply(translator.translate, src='ko', dest='en').apply(getattr, args=('text',))

    df_columns_to_retain = ['시도', '군구', '주소', '충전소명', '시설구분(대)', '시설구분(소)', '기종(대)', '기종(소)',
       '운영기관(대)', '운영기관(소)', '급속충전량', '충전기타입', '충전기ID']
    

    print(df1.columns)
    df1_columns_to_retain = ['영업상태명', '지번주소', '도로명주소', '사업장명', '인허가일자', '폐업일자']
    
    df = df[df_columns_to_retain]
    df1 = df1[df1_columns_to_retain]

    df_tranlsted_columns = []
    for col in df.columns:
        translation = translator.translate(col, dest='en')
        df_tranlsted_columns.append(translation.text)
    df.columns = df_tranlsted_columns

    df1_tranlsted_columns = []
    for col in df1.columns:
        translation = translator.translate(col, dest='en')
        df1_tranlsted_columns.append(translation.text)
    df1.columns = df1_tranlsted_columns

    df.to_csv('ev_charging_stations_parsed.csv', index=False)
    df1.to_csv('gas_stations_seoul_parsed.csv', index=False)
