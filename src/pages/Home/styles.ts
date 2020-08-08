import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  gridContainer: {
    flex: 1,
    padding: 20,
  },
  sider: {
    background: 'url("/background.svg")  no-repeat',
    minHeight: 300,
    backgroundSize: '80%',
    backgroundPosition: 'center',
  },
  siderFront: {
    width: '100%',
    height: '100%',
    color: '#000',
    // background: 'red',
    'backdrop-filter': 'blur(3px) grayscale(0.5)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  paper: {},
  restart: {
    marginTop: 20,
  },
}));
