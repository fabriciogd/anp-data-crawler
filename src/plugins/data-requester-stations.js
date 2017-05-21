require("babel-polyfill");

import cheerio from 'cheerio';
import request from 'request-promise';
import {toFloat} from '../helpers/number-helper';
import config  from '../config/default.json';
import geo from '../helpers/geolocation'

export default function (selSemana, selMunicipio, selCombustivel) {
    return new Promise(function (resolve, reject) {
        var json = [];
        
        var options = {
            url: config.anp_urls.stations,
            method: 'POST',
            encoding: 'binary',
            form: {
                'cod_semana': selSemana.split('*')[0],
                'selMunicipio': selMunicipio,
                'cod_combustivel': selCombustivel.split('*')[0]
            },
            transform: function (body) { return cheerio.load(body); }
        };

        request(options).then(($) => {
        
            $(".multi_box3 > table[class=\'table_padrao scrollable_table\'] > tr").each(function() {
                if($(this).index() >= 1){
                    var cols = $(this).children();

                    let station = {
                        name: cols.eq(0).text(),
                        address: cols.eq(1).text(),
                        area: cols.eq(2).text(),
                        flag: cols.eq(3).text(),
                        sellPrice: toFloat(cols.eq(4).text()),
                        buyPrice: toFloat(cols.eq(5).text()),
                        saleMode: cols.eq(6).text(),
                        provider: cols.eq(7).text(),
                        date: cols.eq(8).text()
                    }
                    
                    json.push(station)
                }
            })

            //Buscar localizações
            var promises = json.map((station) => {
                return new Promise((resolve, reject) => { 
                    geo.geocode(station.address)
                       .then(function(result) { 

                            if(result){
                                var location = result.geometry.location
                                station.location = `${location.lat},${location.lng}` 
                            }

                            resolve()
                        })
                        .catch((err) => {
                            reject(err);
                        })
                })
            })

            Promise.all(promises)
                .then(() => resolve(json))
                .catch((err) => {
                    console.log(err)
                    reject(err);
                })

        }).catch((err) => {
            reject(err);
        });
    })
}