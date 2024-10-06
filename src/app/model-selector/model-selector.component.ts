import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrls: ['./model-selector.component.css']
})
export class ModelSelectorComponent {
  @Output() modelChange = new EventEmitter<any>();

  models = [
    { name: 'GPT-3.5', apiUrl: 'https://api.openai.com/v1', modelName: 'gpt-3.5-turbo' },
    { name: 'GPT-4', apiUrl: 'https://api.openai.com/v1', modelName: 'gpt-4' },
    // Add more models here
  ];

  selectedModel = this.models[0];

  onModelChange() {
    this.modelChange.emit(this.selectedModel);
  }
}