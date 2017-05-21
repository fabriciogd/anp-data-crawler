import request from 'request-promise';
import _ from 'lodash'

export default class Geocoder{
    static geocode(location) {
        return new Promise(function (resolve, reject) {
            var uri = "http://maps.googleapis.com/maps/api/geocode/json";

            var options = {sensor: false, address: location};

            request({
                uri: uri,
                qs:options
            }, function(err,resp,body) {
                if (err) 
                    reject(err);

                var result;

                try {
                    result = JSON.parse(body).results[0];
                } catch (err) {
                    reject(err);
                    return;
                }

                resolve(result)
            })
            
        }).catch((err) => {
            reject(err);
        });
    }
}