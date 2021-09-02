import { makeGetRequest } from '../../dataManegment';
import { AppThunk } from '../slices';
import { selectStructure, setStructures } from '../slices/structures-slice';

export function setStructuresThunk(): AppThunk {
  return (dispatch) => {
    makeGetRequest('liststructures')
      .then((res) => {
        dispatch(setStructures(res));
        dispatch(selectStructure(res[0]));
      })
      .catch(() => { });
  };
}
