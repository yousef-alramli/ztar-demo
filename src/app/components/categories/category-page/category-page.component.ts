import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';

import { DocumentData } from 'firebase/firestore'

import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ModalService } from '../../../services/modal/modal.service';

import { CategoryData, WhereQuery } from '../../../types/firestoreData.types';
import { CustomModalData } from '../../../types/modal.types';

import { CATEGORIES_PATH } from '../../../constants/firestore.const';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    HeaderComponent,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent implements OnInit, OnDestroy {

  @Output() selectCategory = new EventEmitter();

  constructor(
    public firebaseService: FirebaseService,
    public modalService: ModalService,
  ) { }

  displayColumns = ['number', 'value', 'edit', 'delete'];
  getCategoriesSubscribe!: Subscription;

  lastPagesPerIndex: (DocumentData | undefined)[] = [undefined] // Each index represent the last doc for the same page index
  pageCategories: CategoryData[] = [];
  pageIndex: number = 0;
  pageSize: number = 5;
  startCount: number = 0;
  searchQuery: string = '';

  ngOnInit(): void {
    this.getCategories();

  }

  getCategories(whereQuery: WhereQuery[] = []): void {
    const lastDoc: (DocumentData | undefined) = this.lastPagesPerIndex[this.pageIndex];// Configuring the last doc to use it in startAfter for pagination

    this.getCategoriesSubscribe = this.firebaseService.getMultipleDocs(
      CATEGORIES_PATH,
      { customLimit: this.pageSize, startAfterDoc: lastDoc, whereQuery }
    ).subscribe(categoriesDoc => {
      const allCategories: CategoryData[] = [];

      categoriesDoc.docs.forEach(category => {
        allCategories.push({ ...category.data(), id: category.id } as CategoryData);
      });

      this.lastPagesPerIndex.push(categoriesDoc.docs[categoriesDoc.docs.length - 1]);
      this.startCount = this.pageSize * this.pageIndex;

      this.firebaseService.getCategoriesCount(whereQuery);
      this.pageCategories = allCategories;
    });
  }

  onEdit(category: CategoryData): void {
    this.selectCategory.emit(category);
  }

  onDelete(id: string): void {
    const modalData: CustomModalData = {
      cancelButton: {},
      confirmButton: {
        action: () => this.handleDelete(id),
        text: 'Delete'
      },
      header: 'Category delete',
      message: 'Are you sure you want to delete this category',
    };

    this.modalService.openCustomModal(modalData);
  }

  handleDelete(id: string): void {
    this.firebaseService.deleteCategory(id).subscribe(() => {
      this.getCategories();
    })
  }

  onSearch() {
    if (this.searchQuery) {
      const whereQuery: WhereQuery[] = [ // Filter to get all categories that starts with the query
        {
          fieldToFilter: 'value',
          operator: '>=',
          value: this.searchQuery
        },
        {
          fieldToFilter: 'value',
          operator: '<',
          value: this.searchQuery + 'z'
        },
      ];

      this.getCategories(whereQuery);
    } else {
      this.getCategories();
    }
  }

  handlePageEvent(event: PageEvent): void {
    if (this.pageSize !== event.pageSize) {
      this.onPageSizeChange(event.pageSize);
    } else {
      this.pageIndex = event.pageIndex;
    }
    this.getCategories();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 0;
    this.lastPagesPerIndex = [undefined]
  }

  ngOnDestroy(): void {
    this.getCategoriesSubscribe?.unsubscribe()
  }
}
