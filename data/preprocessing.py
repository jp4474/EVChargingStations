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
    #df.to_csv('ev_charging_stations_parsed.csv', index=False)

    df1 = pd.read_csv("gas_stations_seoul.csv", encoding="cp949")
    #df1.to_csv('gas_stations_seoul_parsed.csv', index=False)
    translator = Translator()

    #TODO: translate only the columns we need to reduce running time
    for column in df1.columns:
        print(column)
        df1[column] = df1[column].apply(translator.translate, src='ko', dest='en').apply(getattr, args=('text',))

    print(df1.head())