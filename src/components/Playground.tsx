import { IconNames } from '@blueprintjs/icons';
import * as queryString from 'query-string';
import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import { RouteComponentProps } from 'react-router';

import { InterpreterOutput } from '../reducers/states';
import { LINKS } from '../utils/constants';
import { ExternalLibraryName } from './assessment/assessmentShape';
import Markdown from './commons/Markdown';
import Workspace, { WorkspaceProps } from './workspace';
import { SideContentTab } from './workspace/side-content';
import EnvVisualizer from './workspace/side-content/EnvVisualizer';
import Inspector from './workspace/side-content/Inspector';
import ListVisualizer from './workspace/side-content/ListVisualizer';

const CHAP = '\xa7';

const INTRODUCTION = `
Welcome to the Source Academy playground!

The language _Source_ is the official language of the textbook _Structure and
Interpretation of Computer Programs, JavaScript Adaptation_. You have never
heard of Source? No worries! It was invented just for the purpose of the book.
Source is a sublanguage of ECMAScript 2016 (7th Edition) and defined in [the
documents titled _"Source ${CHAP}x"_](${LINKS.SOURCE_DOCS}), where x refers to
the respective textbook chapter. For example, Source ${CHAP}3 is suitable for
textbook Chapter 3 and the preceeding chapters.

The playground comes with an editor and a REPL, on the left and right of the
screen, respectively. You may customise the layout of the playground by
clicking and dragging on the right border of the editor, or the top border of
the REPL.
`;

export interface IPlaygroundProps extends IDispatchProps, IStateProps, RouteComponentProps<{}> {}

export interface IStateProps {
  activeTab: number;
  editorValue: string;
  editorWidth: string;
  isRunning: boolean;
  output: InterpreterOutput[];
  queryString?: string;
  replValue: string;
  sideContentHeight?: number;
  sourceChapter: number;
  externalLibraryName: string;
  storageToken?: string;
  editorSessionId: string;
  breakpoints: string[];
  highlightedLines: number[][];
  isEditorAutorun: boolean;
  isDebugging: boolean;
  enableDebugging: boolean;
  websocketStatus: number;
}

export interface IDispatchProps {
  handleBrowseHistoryDown: () => void;
  handleBrowseHistoryUp: () => void;
  handleChangeActiveTab: (activeTab: number) => void;
  handleChapterSelect: (chapter: number) => void;
  handleEditorEval: () => void;
  handleEditorValueChange: (val: string) => void;
  handleEditorWidthChange: (widthChange: number) => void;
  handleGenerateLz: () => void;
  handleInterruptEval: () => void;
  handleExternalSelect: (externalLibraryName: ExternalLibraryName) => void;
  handleReplEval: () => void;
  handleReplOutputClear: () => void;
  handleReplValueChange: (newValue: string) => void;
  handleSideContentHeightChange: (heightChange: number) => void;
  handleAccessToken: (accessToken: string) => void;
  handleOpenPicker: () => void;
  handleSavePicker: () => void;
  handleEditorUpdateBreakpoints: (breakpoints: string[]) => void;
  handleInvalidEditorSessionId: () => void;
  handleSetEditorSessionId: (editorSessionId: string) => void;
  handleSetWebsocketStatus: (websocketStatus: number) => void;
  handleDebuggerPause: () => void;
  handleDebuggerResume: () => void;
  handleDebuggerReset: () => void;
  handleToggleEditorAutorun: () => void;
}

type PlaygroundState = {
  isGreen: boolean;
};

class Playground extends React.Component<IPlaygroundProps, PlaygroundState> {
  private keyMap = { goGreen: 'h u l k' };

  private handlers = { goGreen: () => {} };

  constructor(props: IPlaygroundProps) {
    super(props);
    this.state = { isGreen: false };
    this.handlers.goGreen = this.toggleIsGreen.bind(this);
  }

  public render() {
    const workspaceProps: WorkspaceProps = {
      controlBarProps: {
        editorValue: this.props.editorValue,
        editorSessionId: this.props.editorSessionId,
        externalLibraryName: this.props.externalLibraryName,
        handleChapterSelect: ({ chapter }: { chapter: number }, e: any) =>
          this.props.handleChapterSelect(chapter),
        handleExternalSelect: ({ name }: { name: ExternalLibraryName }, e: any) =>
          this.props.handleExternalSelect(name),
        handleEditorEval: this.props.handleEditorEval,
        handleEditorValueChange: this.props.handleEditorValueChange,
        handleGenerateLz: this.props.handleGenerateLz,
        handleInterruptEval: this.props.handleInterruptEval,
        handleInvalidEditorSessionId: this.props.handleInvalidEditorSessionId,
        handleReplEval: this.props.handleReplEval,
        handleReplOutputClear: this.props.handleReplOutputClear,
        handleSetEditorSessionId: this.props.handleSetEditorSessionId,
        handleToggleEditorAutorun: this.props.handleToggleEditorAutorun,
        handleDebuggerPause: this.props.handleDebuggerPause,
        handleDebuggerResume: this.props.handleDebuggerResume,
        handleDebuggerReset: this.props.handleDebuggerReset,
        hasChapterSelect: true,
        hasSaveButton: this.props.storageToken !== undefined,
        hasShareButton: true,
        hasOpenButton: this.props.storageToken !== undefined,
        hasCollabEditing: true,
        hasEditorAutorunButton: true,
        isEditorAutorun: this.props.isEditorAutorun,
        isRunning: this.props.isRunning,
        isDebugging: this.props.isDebugging,
        enableDebugging: this.props.enableDebugging,
        queryString: this.props.queryString,
        questionProgress: null,
        sourceChapter: this.props.sourceChapter,
        onClickOpen: this.props.handleOpenPicker,
        onClickSave: this.props.handleSavePicker,
        websocketStatus: this.props.websocketStatus
      },
      editorProps: {
        editorValue: this.props.editorValue,
        editorSessionId: this.props.editorSessionId,
        handleEditorEval: this.props.handleEditorEval,
        handleEditorValueChange: this.props.handleEditorValueChange,
        isEditorAutorun: this.props.isEditorAutorun,
        breakpoints: this.props.breakpoints,
        highlightedLines: this.props.highlightedLines,
        handleEditorUpdateBreakpoints: this.props.handleEditorUpdateBreakpoints,
        handleSetWebsocketStatus: this.props.handleSetWebsocketStatus
      },
      editorWidth: this.props.editorWidth,
      handleEditorWidthChange: this.props.handleEditorWidthChange,
      handleSideContentHeightChange: this.props.handleSideContentHeightChange,
      replProps: {
        output: this.props.output,
        replValue: this.props.replValue,
        handleBrowseHistoryDown: this.props.handleBrowseHistoryDown,
        handleBrowseHistoryUp: this.props.handleBrowseHistoryUp,
        handleReplEval: this.props.handleReplEval,
        handleReplValueChange: this.props.handleReplValueChange
      },
      sideContentHeight: this.props.sideContentHeight,
      sideContentProps: {
        activeTab: this.props.activeTab,
        handleChangeActiveTab: this.props.handleChangeActiveTab,
        tabs: [playgroundIntroductionTab, listVisualizerTab, inspectorTab, envVisualizerTab]
      }
    };

    if (this.hasAccessToken()) {
      const parsed = queryString.parse(this.props.location.hash);
      this.props.handleAccessToken(parsed.access_token);
    }

    return (
      <HotKeys
        className={'Playground pt-dark' + (this.state.isGreen ? ' GreenScreen' : '')}
        keyMap={this.keyMap}
        handlers={this.handlers}
      >
        <Workspace {...workspaceProps} />
      </HotKeys>
    );
  }

  private hasAccessToken() {
    return window.location.hash.toString().startsWith('#access_token=');
  }

  private toggleIsGreen() {
    this.setState({ isGreen: !this.state.isGreen });
  }
}

const playgroundIntroductionTab: SideContentTab = {
  label: 'Introduction',
  icon: IconNames.COMPASS,
  body: <Markdown content={INTRODUCTION} />
};

const listVisualizerTab: SideContentTab = {
  label: 'Data Visualizer',
  icon: IconNames.EYE_OPEN,
  body: <ListVisualizer />
};

const inspectorTab: SideContentTab = {
  label: 'Inspector',
  icon: IconNames.SEARCH,
  body: <Inspector />
};

const envVisualizerTab: SideContentTab = {
  label: 'Env Visualizer',
  icon: IconNames.EYE_OPEN,
  body: <EnvVisualizer />
};

export default Playground;
