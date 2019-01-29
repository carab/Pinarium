import {useTheme} from '@material-ui/styles';
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery';

export default function useSize(size, direction = 'up') {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints[direction](size));
  return matches;
}
