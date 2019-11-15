import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import trigger from 'ember-drag-sort/utils/trigger'
import {A} from '@ember/array'
import sinon from 'sinon'
import { withChai } from 'ember-cli-chai/qunit'
import wait from 'ember-test-helpers/wait'



moduleForComponent('drag-sort-list', 'Integration | Component | drag sort list', {
  integration : true
})



test('it works', withChai(async function (expect) {
  const items = A([
    {name : 'foo'},
    {name : 'bar'},
    {name : 'baz'},
  ])

  const dragEndCallback = sinon.spy()

  this.setProperties({items, dragEndCallback})

  this.render(hbs`
    {{#drag-sort-list
      items         = items
      dragEndAction = (action dragEndCallback)
      as |item|
    }}
      <div>
        {{item.name}}
      </div>
    {{/drag-sort-list}}
  `)

  const $item0 = this.$('.dragSortItem:eq(0)')
  const $item1 = this.$('.dragSortItem:eq(1)')

  // const itemOffset = $item0.offset()

  trigger($item0, 'dragstart')
  trigger($item1, 'dragover', false)
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).calledOnce

  expect(dragEndCallback).calledWithExactly({
    group       : undefined,
    draggedItem : items.objectAt(0),
    sourceList  : items,
    targetList  : items,
    sourceIndex : 0,
    targetIndex : 1
  })
}))



test('sorting with neither dragover nor dragenter', withChai(async function (expect) {
  const items = A([
    {name : 'foo'},
    {name : 'bar'},
    {name : 'baz'},
  ])

  const dragEndCallback = sinon.spy()

  this.setProperties({items, dragEndCallback})

  this.render(hbs`
    {{#drag-sort-list
      items         = items
      dragEndAction = (action dragEndCallback)
      as |item|
    }}
      <div>
        {{item.name}}
      </div>
    {{/drag-sort-list}}
  `)

  const $item0 = this.$('.dragSortItem:eq(0)')

  // const itemOffset = $item0.offset()

  trigger($item0, 'dragstart')
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).not.called
}))



test('drag handle', withChai(async function (expect) {
  const items = A([
    {name : 'foo'},
    {name : 'bar'},
    {name : 'baz'},
  ])

  const dragEndCallback = sinon.spy()

  this.setProperties({items, dragEndCallback})

  this.render(hbs`
    {{#drag-sort-list
      items         = items
      dragEndAction = (action dragEndCallback)
      handle        = ".handle"
      as |item|
    }}
      <div class="handle">handle</div>
      <div>
        {{item.name}}
      </div>
    {{/drag-sort-list}}
  `)

  const $item0 = this.$('.dragSortItem:eq(0)')
  const $item1 = this.$('.dragSortItem:eq(1)')

  // const itemOffset = $item0.offset()

  trigger($item0, 'dragstart')
  trigger($item1, 'dragover', false)
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).not.called

  trigger($item0.find('.handle'), 'dragstart')
  trigger($item1, 'dragover', false)
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).calledOnce

  expect(dragEndCallback).calledWithExactly({
    group       : undefined,
    draggedItem : items.objectAt(0),
    sourceList  : items,
    targetList  : items,
    sourceIndex : 0,
    targetIndex : 1
  })
}))



test('nested drag handle', withChai(async function (expect) {
  const items = A([
    {name : 'foo'},
    {name : 'bar'},
    {name : 'baz'},
  ])

  const dragEndCallback = sinon.spy()

  this.setProperties({items, dragEndCallback})

  this.render(hbs`
    {{#drag-sort-list
      items         = items
      dragEndAction = (action dragEndCallback)
      handle        = ".handle"
      as |item|
    }}
      <div class="handle">
        <div class="handle2">handle</div>
      </div>
      <div>
        {{item.name}}
      </div>
    {{/drag-sort-list}}
  `)

  const $item0 = this.$('.dragSortItem:eq(0)')
  const $item1 = this.$('.dragSortItem:eq(1)')

  // const itemOffset = $item0.offset()

  trigger($item0, 'dragstart')
  trigger($item1, 'dragover', false)
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).not.called

  trigger($item0.find('.handle2'), 'dragstart')
  trigger($item1, 'dragover', false)
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).calledOnce

  expect(dragEndCallback).calledWithExactly({
    group       : undefined,
    draggedItem : items.objectAt(0),
    sourceList  : items,
    targetList  : items,
    sourceIndex : 0,
    targetIndex : 1
  })
}))

test('customize internal dragSortItem wrapper', withChai(async function (expect) {
  const items = A([
    {name : 'foo'},
    {name : 'bar'},
    {name : 'baz'},
  ])

  const dragEndCallback = sinon.spy()

  this.setProperties({items, dragEndCallback})

  this.render(hbs`
    {{#drag-sort-list
      items         = items
      dragEndAction = (action dragEndCallback)
      yieldDragSortItemComponent = true
      as |item|
    }}
      {{#item.Component class="foo"}}
        <div class="handle">
          <div class="handle2">handle</div>
        </div>
        <div>
          {{item.name}}
        </div>
      {{/item.Component}}
    {{/drag-sort-list}}
  `)

  // check for custom class in addition to internal class. Test that drag and drop sorting still works
  const $item0 = this.$('.dragSortItem.foo:eq(0)')
  const $item1 = this.$('.dragSortItem.foo:eq(1)')

  // const itemOffset = $item0.offset()

  trigger($item0, 'dragstart')
  trigger($item1, 'dragover', false)
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).not.called

  trigger($item0.find('.handle2'), 'dragstart')
  trigger($item1, 'dragover', false)
  trigger($item0, 'dragend')

  await wait()

  expect(dragEndCallback).calledOnce

  expect(dragEndCallback).calledWithExactly({
    group       : undefined,
    draggedItem : items.objectAt(0),
    sourceList  : items,
    targetList  : items,
    sourceIndex : 0,
    targetIndex : 1
  })
}))
