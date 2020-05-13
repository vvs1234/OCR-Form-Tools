// tslint:disable:no-empty-interface
import { BaseComponent, IRefObject } from "@uifabric/utilities";
import { ISelection } from "office-ui-fabric-react";
import * as React from "react";

export interface IViewSelection {}

export interface IViewSelectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  componentRef?: IRefObject<IViewSelection>;

  /**
   * The selection object to interact with when updating selection changes.
   */
  selection: ISelection;

  items: any[];

  allModels: any[];

  columns: any[];

  isComposing: boolean;
}

export interface IViewSelectionState {}

export class ViewSelection extends BaseComponent<
  IViewSelectionProps,
  IViewSelectionState
> {
  private selectedIndices: any[];
  constructor(props: IViewSelectionProps) {
    super(props);
    this.state = {};
    this.selectedIndices = [];
  }

  public render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }

  public componentWillUpdate(nextProps: IViewSelectionProps, nextState: IViewSelectionState) {
    this.saveSelection();
  }

  public componentDidUpdate(prevProps: IViewSelectionProps, prevState: IViewSelectionState) {
    if (prevProps.columns === this.props.columns) {
        this.restoreSelection();
    }
    if (prevProps.isComposing === true && (prevProps.isComposing !== this.props.isComposing)) {
        this.props.selection.setAllSelected(false);
        this.selectedIndices = [];
    }
  }

  private toListIndex(index: number) {
    const viewItems = this.props.selection.getItems();
    const viewItem = viewItems[index];
    return this.props.allModels.findIndex((listItem) => listItem === viewItem);
    }

  private toViewIndex(index: number) {
    const listItem = this.props.allModels[index];
    const viewIndex = this.props.selection
      .getItems()
      .findIndex((viewItem) => viewItem === listItem);
    return viewIndex;
  }

  private saveSelection(): void {
    const newIndices = this.props.selection
      .getSelectedIndices()
      .map((index) => this.toListIndex(index))
      .filter((index) => this.selectedIndices.indexOf(index) === -1);

    const unselectedIndices = this.props.selection
      .getItems()
      .map((item, index) => index)
      .filter((index) => this.props.selection.isIndexSelected(index) === false)
      .map((index) => this.toListIndex(index));

    this.selectedIndices = this.selectedIndices.filter(
      (index) => unselectedIndices.indexOf(index) === -1,
    );

    this.selectedIndices = [...this.selectedIndices, ...newIndices];
  }

  private restoreSelection(): void {
    const indices = this.selectedIndices
      .map((index) => this.toViewIndex(index))
      .filter((index) => index !== -1);
    for (const index of indices) {
      this.props.selection.setIndexSelected(index, true, false);
    }
  }
}
