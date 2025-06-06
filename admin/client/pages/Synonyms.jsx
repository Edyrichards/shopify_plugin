import React, { useEffect, useState } from 'react';
import { Page, Card, ResourceList, TextField, Button } from '@shopify/polaris';

export default function Synonyms() {
  const [items, setItems] = useState([]);
  const [term, setTerm] = useState('');
  const [syns, setSyns] = useState('');

  async function fetchSynonyms() {
    const res = await fetch('/synonyms');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => { fetchSynonyms(); }, []);

  async function addSynonym() {
    await fetch('/synonyms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term, synonyms: syns.split(',').map(s => s.trim()) })
    });
    setTerm('');
    setSyns('');
    fetchSynonyms();
  }

  async function deleteSyn(id) {
    await fetch(`/synonyms/${id}`, { method: 'DELETE' });
    fetchSynonyms();
  }

  return (
    <Page title="Synonyms">
      <Card sectioned>
        <TextField label="Term" value={term} onChange={setTerm} autoComplete="off" />
        <TextField label="Synonyms" value={syns} onChange={setSyns} autoComplete="off" helpText="Comma separated" />
        <Button onClick={addSynonym} primary>Add</Button>
      </Card>
      <Card>
        <ResourceList
          resourceName={{singular: 'synonym', plural: 'synonyms'}}
          items={items}
          renderItem={(item) => {
            return (
              <ResourceList.Item
                id={item.id}
                accessibilityLabel={`Delete ${item.term}`}
                shortcutActions={[{content: 'Delete', onAction: () => deleteSyn(item.id)}]}
              >
                <h3>{item.term}</h3>
                <div>{item.synonyms.join(', ')}</div>
              </ResourceList.Item>
            );
          }}
        />
      </Card>
    </Page>
  );
}
