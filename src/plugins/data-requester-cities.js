import cheerio from 'cheerio';
import request from 'request-promise';
import {toFloat} from '../helpers/number-helper';
import config  from '../config/default.json';

export default function (selSemana, selEstado, selCombustivel) {

    return new Promise(function (resolve, reject) {
        var json = [];
        
        var options = {
            url: config.anp_urls.cities,
            method: 'POST',
            encoding: 'binary',
            form: {
                'selSemana': selSemana,
                'selEstado': selEstado,
                'selCombustivel': selCombustivel
            },
            transform: function (body) { return cheerio.load(body); }
        };

        request(options).then(($) => {
            
            $('.table_padrao > tr').each(function () {
                if ($(this).index() > 2) {
                    var cols = $(this).children();

                    let name = cols.eq(0).text();
                    let value =  cols.eq(0).children('a')[0].attribs.href.split('\'')[1];

                    let consumerPrice = {
                        averagePrice: toFloat(cols.eq(2).text()),
                        standardDeviation: toFloat(cols.eq(3).text()),
                        minPrice: toFloat(cols.eq(4).text()),
					              maxPrice: toFloat(cols.eq(5).text()),
                        averageMargin: toFloat(cols.eq(6).text())
                    }

                    let distributionPrice = {
                        averagePrice: toFloat(cols.eq(7).text()),
                        standardDeviation: toFloat(cols.eq(8).text()),
                        minPrice: toFloat(cols.eq(9).text()),
                        maxPrice: toFloat(cols.eq(10).text()),
                    }

                    json.push({
                        name: name, 
                        value: value,
                        consumerPrice: consumerPrice, 
                        distributionPrice: distributionPrice
                    })
                }
            });

            resolve(json);

        }).catch((err) => {

            reject(err);
        });
    });
}
