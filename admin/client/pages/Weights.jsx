import React, { useEffect, useState } from 'react';
import { Page, Card, ResourceList, TextField, Button } from '@shopify/polaris';

export default function Weights() {
  const [items, setItems] = useState([]);
  const [field, setField] = useState('');
  const [weight, setWeight] = useState('1');

  async function fetchWeights() {
    const res = await fetch('/weights');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => { fetchWeights(); }, []);

  async function updateWeight() {
    await fetch('/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, weight: parseFloat(weight) })
    });
    setField('');
    setWeight('1');
    fetchWeights();
  }

  return (
    <Page title="Field Weights">
      <Card sectioned>
        <TextField label="Field" value={field} onChange={setField} />
        <TextField label="Weight" value={weight} onChange={setWeight} />
        <Button onClick={updateWeight} primary>Save</Button>
      </Card>
      <Card>
        <ResourceList
          resourceName={{singular: 'field', plural: 'fields'}}
          items={items}
          renderItem={(item) => {
            return (
              <ResourceList.Item id={item.field} accessibilityLabel={`field ${item.field}`}> 
                <div>{item.field}</div>
                <div>Weight: {item.weight}</div>
              </ResourceList.Item>
            );
          }}
        />
      </Card>
    </Page>
  );
}
