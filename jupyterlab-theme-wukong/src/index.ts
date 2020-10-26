import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-theme-wukong extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-theme-wukong',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-theme-wukong is activated!');
  }
};

export default extension;
