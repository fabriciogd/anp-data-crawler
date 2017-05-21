import cheerio from 'cheerio';
import request from 'request-promise';
import config  from '../config/default.json';

export default function () {

    function formatWeek(desc) {
        desc = desc.replace('de ', '').split(' a ');

        var dateInit = desc[0].split('/');
        var dateEnd = desc[1].split('/');

        return {
            from: new Date(dateInit[2], dateInit[1] - 1, dateInit[0]),
			to: new Date(dateEnd[2], dateEnd[1] - 1, dateEnd[0])
        }
    }

    return new Promise(function (resolve, reject) {
        var json = {};

        let options = {
            url: config.anp_urls.index,
            method: 'GET',
            encoding: 'binary',
            transform: function(body) {
                return cheerio.load(body);
            }
        };

        request(options).then(($) => {

            $("#frmAberto").filter(() => {
                var fuels = [], 
                    states = [];
                    
                json.week          = $('[name="cod_Semana"]').val();
                json.selWeek       = $('[name="selSemana"]').val();
                json.descWeek      = $('[name="desc_Semana"]').val();
                json.formattedWeek = formatWeek($('[name="desc_Semana"]').val());
                json.type          = $('[name="tipo"]').val();

                // Get all the fuels (code can't be es6)
                $('#selCombustivel option').each(function() {
                    fuels.push({name: $(this).text(), value: $(this).val()});
                });

                // Get all the states
                $('[name="selEstado"]>option').each(function() {
                    states.push({name:  $(this).text(), value: $(this).val()});
                });

                json.fuels  = fuels;
                json.states = states;
            });

            resolve(json);

        }).catch((err) => {

            reject(err);
        });
    })
} 