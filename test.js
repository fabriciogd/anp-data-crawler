import assert from 'assert';
import requester_states from './src/plugins/data-requester-states';
import requester_cities from './src/plugins/data-requester-cities';
import requester_stations from './src/plugins/data-requester-stations';

describe('test', () => {

    it('Returns states and fuels', () => {
        return requester_states().then(function(json){

            console.log(json)

        }).catch(function(ex) {

            console.error(ex);
            throw ex;

        });
    })

    it('Returns cities', () => {
        return requester_cities('931*De 16/04/2017 a 22/04/2017', 'AC*ACRE', '487*Gasolina').then(function(json){

            console.log(json)

        }).catch(function(ex) {

            console.error(ex);
            throw ex;

        });
    })

    it('Returns stations', () => {
        return requester_stations('931', '6*CRUZEIRO@DO@SUL', '487').then(function(json){
            console.log(json)
        })
        .catch(function(ex) {
            console.error(ex);
        });
    })
})